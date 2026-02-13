import { PaginatedResultSchema } from "@trektoeic/schemas/share-schema";
import { VocabularySchema } from "@trektoeic/schemas/vocabularies-schema";
import { getPagination } from "@trektoeic/utils/get-pagination";
import { withUserAndKysely } from "../../utils";

export const getVocabulariesByCategoryId = withUserAndKysely((_userId, db) => {
	return async ({
		categoryId,
		page = 1,
		limit = 10,
	}: {
		categoryId: string;
		page: number;
		limit: number;
	}) => {
		const [records, count] = await Promise.all([
			db
				.selectFrom("vocabularies")
				.selectAll()
				.where("categoryId", "=", categoryId)
				.orderBy("name", "asc")
				.limit(limit)
				.offset((page - 1) * limit)
				.execute(),
			db
				.selectFrom("vocabularies")
				.select(db.fn.count<number>("id").as("count"))
				.where("categoryId", "=", categoryId)
				.execute()
				.then((res) => Number(res[0]?.count ?? 0)),
		]);
		// Normalize collection: DB may have array from old/toeicmax data; schema expects object | null
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
				limit,
				page,
			}),
		);
	};
});
