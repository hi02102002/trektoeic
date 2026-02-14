import z from "zod";
import { DateLikeSchema } from "./share-schema";
import { VocabularySchema } from "./vocabularies-schema";

export const VocabularyReviewStateSchema = z.enum([
	"new",
	"learning",
	"review",
	"mastered",
]);

export const VocabularyReviewGradeSchema = z.enum([
	"again",
	"hard",
	"good",
	"easy",
]);

export const VocabularyReviewCardSchema = z.object({
	id: z.string(),
	userId: z.string(),
	vocabularyId: z.string(),
	state: VocabularyReviewStateSchema,
	repetitions: z.number(),
	lapses: z.number(),
	intervalDays: z.number(),
	easeFactor: z.number(),
	nextReviewAt: DateLikeSchema,
	lastReviewedAt: DateLikeSchema.nullable().optional(),
	createdAt: DateLikeSchema,
	updatedAt: DateLikeSchema,
});

export const VocabularyReviewLogSchema = z.object({
	id: z.string(),
	userId: z.string(),
	vocabularyId: z.string(),
	reviewCardId: z.string().nullable().optional(),
	grade: VocabularyReviewGradeSchema,
	reviewedAt: DateLikeSchema,
	stateBefore: VocabularyReviewStateSchema,
	stateAfter: VocabularyReviewStateSchema,
	intervalBeforeDays: z.number().nullable().optional(),
	intervalAfterDays: z.number(),
	easeBefore: z.number().nullable().optional(),
	easeAfter: z.number(),
	nextReviewAt: DateLikeSchema,
	createdAt: DateLikeSchema,
	updatedAt: DateLikeSchema,
});

export const VocabularyReviewCardScheduleSchema = z.object({
	state: VocabularyReviewStateSchema,
	repetitions: z.number().int().min(0),
	lapses: z.number().int().min(0),
	intervalDays: z.number().int().min(0),
	easeFactor: z.number().int().min(130),
	nextReviewAt: DateLikeSchema,
	lastReviewedAt: DateLikeSchema.nullable().optional(),
});

export const VocabularyReviewIntervalPreviewSchema = z.object({
	again: z.string(),
	hard: z.string(),
	good: z.string(),
	easy: z.string(),
});

export const VocabularyReviewDueItemSchema = z.object({
	vocabulary: VocabularySchema,
	cardId: z.string().nullable().optional(),
	schedule: VocabularyReviewCardScheduleSchema,
	intervalPreview: VocabularyReviewIntervalPreviewSchema,
});

export const VocabularyReviewStatsSchema = z.object({
	total: z.number().int().min(0),
	due: z.number().int().min(0),
	new: z.number().int().min(0),
	learning: z.number().int().min(0),
	review: z.number().int().min(0),
	mastered: z.number().int().min(0),
});

export const GetDueVocabulariesInputSchema = z.object({
	categoryId: z.string().optional(),
	limit: z.number().int().positive().optional().default(20),
});

export const ReviewVocabularyInputSchema = z.object({
	vocabularyId: z.string(),
	grade: VocabularyReviewGradeSchema,
});

export const ReviewVocabularyResultSchema = z.object({
	reviewed: VocabularyReviewDueItemSchema,
	nextCard: VocabularyReviewDueItemSchema.nullable(),
	dueRemaining: z.number().int().min(0),
});

export type VocabularyReviewState = z.infer<typeof VocabularyReviewStateSchema>;
export type VocabularyReviewGrade = z.infer<typeof VocabularyReviewGradeSchema>;
export type VocabularyReviewCard = z.infer<typeof VocabularyReviewCardSchema>;
export type VocabularyReviewLog = z.infer<typeof VocabularyReviewLogSchema>;
export type VocabularyReviewCardSchedule = z.infer<
	typeof VocabularyReviewCardScheduleSchema
>;
export type VocabularyReviewDueItem = z.infer<
	typeof VocabularyReviewDueItemSchema
>;
export type VocabularyReviewStats = z.infer<typeof VocabularyReviewStatsSchema>;
