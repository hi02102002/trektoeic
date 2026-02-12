import { VocabularyCategorySchema } from "@trektoeic/schemas/vocabularies-schema";
import { withUserAndKysely } from "../../utils";
import { buildCategoriesQuery } from "./build-categories-query";

export const getCategoryById = withUserAndKysely((_userId, db) => {
	return async ({ id }: { id: string }) => {
		const record = await buildCategoriesQuery(db)
			.where("vocabularyCategories.id", "=", id)
			.executeTakeFirst();
		return VocabularyCategorySchema.parse(record);
	};
});
