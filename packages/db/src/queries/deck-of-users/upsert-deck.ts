import { createId } from "@trektoeic/utils/create-id";
import { withKysely } from "../../utils";

export const upsertDeckOfUser = withKysely((db) => {
	return async ({
		categoryId,
		userId,
	}: {
		userId: string;
		categoryId: string;
	}) => {
		const res = await db
			.insertInto("deckOfUsers")
			.values({
				userId,
				categoryId,
				id: createId(),
			})
			.onConflict((oc) =>
				oc.columns(["userId", "categoryId"] as const).doUpdateSet({
					userId,
					categoryId,
					updatedAt: new Date(),
				}),
			)
			.returningAll()
			.executeTakeFirst();

		return res;
	};
});

export const upsertDeckOfUserByVocabularyId = withKysely((db) => {
	return async ({
		vocabularyId,
		userId,
	}: {
		userId: string;
		vocabularyId: string;
	}) => {
		const category = await db
			.selectFrom("vocabularyCategories as c")
			.leftJoin("vocabularies as v", (join) =>
				join.onRef("v.categoryId", "=", "c.id"),
			)
			.select("c.id")
			.where("v.id", "=", vocabularyId)
			.executeTakeFirst();

		console.log("category", category);

		if (!category) {
			return;
		}

		return upsertDeckOfUser(db)({
			userId,
			categoryId: category.id,
		});
	};
});
