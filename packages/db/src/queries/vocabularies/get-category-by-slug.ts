import { VocabularyCategorySchema } from "@trektoeic/schemas/vocabularies-schema";
import { withUserAndKysely } from "../../utils";
import { buildCategoriesQuery } from "./build-categories-query";

export const getCategoryBySlug = withUserAndKysely((_userId, db) => {
	return async ({ slug }: { slug: string }) => {
		const record = await buildCategoriesQuery(db, _userId)
			.where("vocabularyCategories.slug", "=", slug)
			.executeTakeFirst();
		return VocabularyCategorySchema.parse(record);
	};
});
