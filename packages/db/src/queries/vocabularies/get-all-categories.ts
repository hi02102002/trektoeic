import { VocabularyCategorySchema } from "@trektoeic/schemas/vocabularies-schema";
import { kSql } from "../../libs/kysely";
import { withUserAndKysely } from "../../utils";
import { buildCategoriesQuery } from "./build-categories-query";

export const getAllCategories = withUserAndKysely((_userId, db) => {
	return async ({
		parentId,
		level = 1,
	}: {
		parentId?: string;
		level?: number;
	}) => {
		const records = await buildCategoriesQuery(db, _userId)
			.$if(parentId !== undefined, (qb) =>
				qb.where("vc.parentId", "=", parentId as string),
			)
			.$if(level !== undefined, (qb) =>
				qb.where("vc.level", "=", level as number),
			)
			.orderBy(
				kSql`COALESCE(SUBSTRING(vc.name FROM '([0-9]+)')::int, 2147483647)`,
				"asc",
			)
			.orderBy("vc.name", "asc")
			.execute();

		return VocabularyCategorySchema.array().parse(records);
	};
});
