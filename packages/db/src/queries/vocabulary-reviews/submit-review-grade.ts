import { createId } from "@trektoeic/utils/create-id";
import { VocabularyReviewScheduler } from "@trektoeic/utils/vocabulary-review-scheduler";
import { withUserAndKysely } from "../../utils";

export const submitReviewGrade = withUserAndKysely((userId, db) => {
	return async ({
		vocabularyId,
		grade,
	}: {
		vocabularyId: string;
		grade: "again" | "hard" | "good" | "easy";
	}) => {
		const scheduler = new VocabularyReviewScheduler();
		const existingCard = await db
			.selectFrom("vocabularyReviewCards")
			.selectAll()
			.where("userId", "=", userId)
			.where("vocabularyId", "=", vocabularyId)
			.executeTakeFirst();

		const computation = scheduler.applyGrade({
			card: scheduler.normalizeCard(existingCard),
			grade,
		});

		const upsertedCard = await db
			.insertInto("vocabularyReviewCards")
			.values({
				id: createId(),
				userId,
				vocabularyId,
				state: computation.after.state,
				repetitions: computation.after.repetitions,
				lapses: computation.after.lapses,
				intervalDays: computation.after.intervalDays,
				easeFactor: computation.after.easeFactor,
				nextReviewAt: new Date(computation.nextReviewAt),
				lastReviewedAt: new Date(),
			})
			.onConflict((oc) =>
				oc.columns(["userId", "vocabularyId"]).doUpdateSet({
					state: computation.after.state,
					repetitions: computation.after.repetitions,
					lapses: computation.after.lapses,
					intervalDays: computation.after.intervalDays,
					easeFactor: computation.after.easeFactor,
					nextReviewAt: new Date(computation.nextReviewAt),
					lastReviewedAt: new Date(),
					updatedAt: new Date(),
				}),
			)
			.returningAll()
			.executeTakeFirstOrThrow();

		const preview = {
			...computation,
			nextReviewAt: new Date(computation.nextReviewAt),
			nextReviewInMs: Number(computation.nextReviewInMs),
			intervalLabel: String(computation.intervalLabel),
		};

		return {
			review: upsertedCard,
			preview,
		};
	};
});
