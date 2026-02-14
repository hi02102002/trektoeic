import { GetDueVocabulariesResultSchema } from "@trektoeic/schemas/vocabulary-review-schema";
import { VocabularyReviewScheduler } from "@trektoeic/utils/vocabulary-review-scheduler";
import type z from "zod";
import {
	drizzleColumnNames,
	jsonColsFromNames,
	kJsonObjectAgg,
} from "../../libs/kysely";
import { vocabularyReviewCards } from "../../schema";
import { withKysely } from "../../utils";

const withScheduler = (
	records: z.infer<typeof GetDueVocabulariesResultSchema>,
) => {
	const scheduler = new VocabularyReviewScheduler();

	const mapped = records.map((record) => ({
		...record,
		preview: scheduler.preview(
			scheduler.normalizeCard(record.review ?? undefined),
		),
	}));

	return mapped;
};

export const getDueVocabularies = withKysely((db) => {
	return async ({
		categoryId,
		limit = 20,
		userId,
	}: {
		categoryId?: string;
		limit?: number;
		userId: string;
	}) => {
		const records = await db
			.selectFrom("vocabularies as v")
			.leftJoin("vocabularyReviewCards as vrc", (join) =>
				join
					.onRef("v.id", "=", "vrc.vocabularyId")
					.on("vrc.userId", "=", userId),
			)
			.selectAll("v")
			.select((eb) => [
				kJsonObjectAgg(
					jsonColsFromNames(
						eb,
						"vrc",
						drizzleColumnNames(vocabularyReviewCards),
					),
					{ nullIf: eb.ref("vrc.id") },
				).as("review"),
			])
			.where((eb) =>
				eb.or([
					eb("vrc.nextReviewAt", "<=", new Date()),
					eb("vrc.id", "is", null),
				]),
			)
			.$if(!!categoryId, (eb) =>
				eb.where("v.categoryId", "=", categoryId as string),
			)
			.orderBy("vrc.nextReviewAt", "asc")
			.orderBy("v.createdAt", "asc")
			.limit(limit ?? 20)
			.groupBy("v.id")
			.groupBy("vrc.nextReviewAt")
			.execute();

		const parsed = GetDueVocabulariesResultSchema.parse(records);

		const withPreviews = withScheduler(parsed);

		return GetDueVocabulariesResultSchema.parse(withPreviews);
	};
});
