import type { InferSort } from "@trektoeic/schemas/share-schema";
import { getPagination } from "@trektoeic/utils/get-pagination";
import { withKysely } from "../../utils";
import { buildCategoriesQuery } from "../vocabularies/build-categories-query";

export const getDeckOfUser = withKysely((db) => {
	return async ({
		userId,
		limit = 20,
		page = 1,
		query,
		sort = {
			direction: "desc",
			field: "du.updatedAt",
		},
	}: {
		userId: string;
		limit?: number;
		page?: number;
		query?: string;
		sort?: InferSort<["du.updatedAt", "du.createdAt", "vc.name"]>;
	}) => {
		const [res, { total: totalItems }] = await Promise.all([
			buildCategoriesQuery(db, userId)
				.innerJoin("deckOfUsers as du", (join) =>
					join
						.onRef("du.categoryId", "=", "vc.id")
						.on("du.userId", "=", userId),
				)
				.$if(!!query, (qb) =>
					qb.where("vc.name", "like", `%${query?.toLowerCase()}%`),
				)
				.selectAll("vc")
				.orderBy(sort.field, sort.direction)
				.limit(limit)
				.offset((page - 1) * limit)
				.execute(),
			db
				.selectFrom("deckOfUsers as du")
				.select((eb) => eb.fn.count<number>("du.id").as("total"))
				.where("du.userId", "=", userId)
				.executeTakeFirstOrThrow(),
		]);

		return getPagination({
			items: res,
			totalItems,
			page,
			limit,
		});
	};
});
