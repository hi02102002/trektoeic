import z from "zod";

export const MockTestContentSchema = z.object({
	questionId: z.string(),
	subQuestionId: z.string(),
	userAnswer: z.string(),
	isCorrect: z.boolean(),
	timeTaken: z.number().nullable().optional(),
	isFlagged: z.boolean().optional(),
});

export const MockTestMetadataSchema = z.object({
	duration: z.number().nullable().optional(),
	totalTime: z.number().nullable().optional(),
	numberOfQuestions: z.number(),
	numberOfCorrectQuestions: z.number().nullable().optional(),
	numberOfWrongQuestions: z.number().nullable().optional(),
	numberOfUnansweredQuestions: z.number().nullable().optional(),
	avgTimePerQuestion: z.number().nullable().optional(),
	performancePercentile: z.number().nullable().optional(),
	kitId: z.string(),
	title: z.string(),
	year: z.coerce.number(),
});

export const PartPracticeHistorySchema = z.object({
	metadata: MockTestMetadataSchema,
	contents: z.array(MockTestContentSchema),
	id: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	action: z.literal("mock_test"),
});

export const InputMockTestHistorySchema = z.object({
	metadata: MockTestMetadataSchema,
	contents: z.array(MockTestContentSchema),
	id: z.string().optional(),
});

export type MockTestContent = z.infer<typeof MockTestContentSchema>;
export type MockTestMetadata = z.infer<typeof MockTestMetadataSchema>;
export type PartPracticeHistory = z.infer<typeof PartPracticeHistorySchema>;
export type InputMockTestHistory = z.infer<typeof InputMockTestHistorySchema>;
