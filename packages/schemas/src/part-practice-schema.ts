import z from "zod";

export const PartPracticeModeSchema = z.enum(["normal", "timed"]);

export const PartPracticeContentSchema = z.object({
	questionId: z.string(),
	subQuestionId: z.string(),
	userAnswer: z.string(),
	isCorrect: z.boolean(),
	timeTaken: z.number().nullable().optional(),
	isFlagged: z.boolean().optional(),
});

export const PartPracticeMetadataSchema = z.object({
	part: z.number(),
	mode: PartPracticeModeSchema,
	duration: z.number().nullable().optional(),
	numberOfQuestions: z.number(),
	numberOfCorrectQuestions: z.number().nullable().optional(),
	numberOfWrongQuestions: z.number().nullable().optional(),
	numberOfUnansweredQuestions: z.number().nullable().optional(),
	avgTimePerQuestion: z.number().nullable().optional(),
	performancePercentile: z.number().nullable().optional(),
});

export const PartPracticeHistorySchema = z.object({
	metadata: PartPracticeMetadataSchema,
	contents: z.array(PartPracticeContentSchema),
	id: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	action: z.literal("practice_part"),
});

export const InputPartPracticeHistorySchema = z.object({
	metadata: PartPracticeMetadataSchema,
	contents: z.array(PartPracticeContentSchema),
	id: z.string().optional(),
});

export type PartPracticeMode = z.infer<typeof PartPracticeModeSchema>;
export type PartPracticeHistory = z.infer<typeof PartPracticeHistorySchema>;
export type PartPracticeContent = z.infer<typeof PartPracticeContentSchema>;
export type PartPracticeMetadata = z.infer<typeof PartPracticeMetadataSchema>;
export type InputPartPracticeHistory = z.infer<
	typeof InputPartPracticeHistorySchema
>;
