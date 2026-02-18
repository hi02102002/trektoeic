import z from "zod";
import { DateLikeSchema } from "./share-schema";
import { VocabularySchema } from "./vocabularies-schema";
import {
	VocabularyReviewGradeSchema,
	VocabularyReviewStateSchema,
} from "./vocabularies-shared-schema";

export const VocabularyReviewCardSchema = z.object({
	id: z.string(),
	userId: z.string(),
	vocabularyId: z.string(),
	state: VocabularyReviewStateSchema,
	repetitions: z.number(),
	lapses: z.number(),
	intervalDays: z.number(),
	easeFactor: z.number(),
	nextReviewAt: DateLikeSchema.optional(),
	lastReviewedAt: DateLikeSchema.nullable().optional(),
	createdAt: DateLikeSchema,
	updatedAt: DateLikeSchema,
});

export const VocabularyReviewCardScheduleSchema = z.object({
	state: VocabularyReviewStateSchema,
	repetitions: z.number().int().min(0),
	lapses: z.number().int().min(0),
	intervalDays: z.number().int().min(0),
	easeFactor: z.number().int().min(130),
	nextReviewAt: DateLikeSchema.optional(),
	lastReviewedAt: DateLikeSchema.nullable().optional(),
});

export const VocabularyReviewCardPreviewSchema = z.object({
	grade: VocabularyReviewGradeSchema,
	before: VocabularyReviewCardScheduleSchema,
	after: VocabularyReviewCardScheduleSchema,
	nextReviewAt: DateLikeSchema,
	nextReviewInMs: z.number(),
	intervalLabel: z.string(),
});

export const DueVocabularyCategorySchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const GetDueVocabulariesResultSchema = z.array(
	z.object(VocabularySchema.shape).extend({
		review: VocabularyReviewCardSchema.nullable().optional(),
		preview: z
			.record(z.string(), VocabularyReviewCardPreviewSchema)
			.nullable()
			.optional(),
		category: DueVocabularyCategorySchema.nullable().optional(),
	}),
);

export type VocabularyReviewState = z.infer<typeof VocabularyReviewStateSchema>;
export type VocabularyReviewGrade = z.infer<typeof VocabularyReviewGradeSchema>;
export type VocabularyReviewCard = z.infer<typeof VocabularyReviewCardSchema>;

export type VocabularyReviewCardSchedule = z.infer<
	typeof VocabularyReviewCardScheduleSchema
>;
