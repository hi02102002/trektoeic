import { PaginatedResultSchema } from "@trektoeic/schemas/share-schema";
import { VocabularySchema } from "@trektoeic/schemas/vocabularies-schema";
import { getPagination } from "@trektoeic/utils/get-pagination";
import { withUserAndKysely } from "../../utils";
import { whereCategoryInTree } from "../shared";

export const getVocabulariesByCategoryId = withUserAndKysely((userId, db) => {
	return async ({
		categoryId,
		page,
		limit,
	}: {
		categoryId: string;
		page?: number;
		limit?: number;
	}) => {
		const shouldPaginate = page != null && limit != null;
		const currentPage = page ?? 1;
		const [records, count] = await Promise.all([
			(() => {
				const baseQuery = db
					.selectFrom("vocabularies as v")
					.leftJoin("vocabularyReviewCards as vrc", (join) =>
						join
							.onRef("vrc.vocabularyId", "=", "v.id")
							.on("vrc.userId", "=", userId),
					)
					.selectAll("v")
					.select("vrc.state")
					.where(whereCategoryInTree(db, "v.categoryId", categoryId))
					.orderBy("name", "asc");

				if (shouldPaginate) {
					return baseQuery
						.limit(limit as number)
						.offset((currentPage - 1) * (limit as number))
						.execute();
				}

				return baseQuery.execute();
			})(),
			db
				.selectFrom("vocabularies as v")
				.where(whereCategoryInTree(db, "v.categoryId", categoryId))
				.select((eb) => [eb.fn.count<number>("v.id").as("count")])
				.execute()
				.then((res) => Number(res[0]?.count ?? 0)),
		]);

		const normalized = records.map((r) => ({
			...r,
			collection:
				r.collection != null && !Array.isArray(r.collection)
					? r.collection
					: null,
		}));

		return PaginatedResultSchema(VocabularySchema).parse(
			getPagination({
				items: normalized,
				totalItems: count,
				limit: shouldPaginate ? (limit as number) : Math.max(count, 1),
				page: shouldPaginate ? currentPage : 1,
			}),
		);
	};
});
