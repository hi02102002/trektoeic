import { VocabularySchema } from "@trektoeic/schemas/vocabularies-schema";
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
		const records = await db
			.selectFrom("vocabularies")
			.selectAll()
			.where("categoryId", "=", categoryId)
			.orderBy("name", "asc")
			.limit(limit)
			.offset((page - 1) * limit)
			.execute();
		// Normalize collection: DB may have array from old/toeicmax data; schema expects object | null
		const normalized = records.map((r) => ({
			...r,
			collection:
				r.collection != null && !Array.isArray(r.collection)
					? r.collection
					: null,
		}));
		return VocabularySchema.array().parse(normalized);
	};
});
