import { createId } from "@trektoeic/utils/create-id";
import { withUserAndKysely } from "../../utils";

export const setGrammarTopicStudied = withUserAndKysely((userId, db) => {
	return async (input: { slug: string; studied: boolean }) => {
		const topic = await db
			.selectFrom("grammarTopics")
			.select("id")
			.where("slug", "=", input.slug)
			.executeTakeFirst();

		if (!topic) {
			return { ok: false as const, error: "not_found" as const };
		}

		if (input.studied) {
			await db
				.insertInto("grammarTopicStudied")
				.values({
					id: createId(),
					userId,
					topicId: topic.id,
				})
				.onConflict((oc) =>
					oc.columns(["userId", "topicId"]).doUpdateSet({
						studiedAt: new Date(),
						updatedAt: new Date(),
					}),
				)
				.execute();
		} else {
			await db
				.deleteFrom("grammarTopicStudied")
				.where("userId", "=", userId)
				.where("topicId", "=", topic.id)
				.execute();
		}

		return { ok: true as const };
	};
});
