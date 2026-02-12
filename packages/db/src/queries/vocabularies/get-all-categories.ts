import { VocabularyCategorySchema } from "@trektoeic/schemas/vocabularies-schema";
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
		const records = await buildCategoriesQuery(db)
			.$if(parentId !== undefined, (qb) =>
				qb.where("vocabularyCategories.parentId", "=", parentId as string),
			)
			.$if(level !== undefined, (qb) =>
				qb.where("vocabularyCategories.level", "=", level as number),
			)
			.orderBy("vocabularyCategories.name", "asc")
			.execute();
		return VocabularyCategorySchema.array().parse(records);
	};
});
