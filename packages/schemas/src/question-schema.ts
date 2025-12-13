import { cleanNullVal } from "@trektoeic/utils/clean-null-val";
import z from "zod";

export const QuestionSchema = z.object({
	id: z.string(),
	updatedAt: z.union([z.string(), z.date()]),
	createdAt: z.union([z.string(), z.date()]),
	part: z.number(),
	audioUrl: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	teaser: z.object({
		text: z.string().nullable().optional(),
		tran: z.record(z.string(), z.string().nullable().optional()),
	}),
	total: z.number(),
	kitId: z.string(),
});

export const SubQuestionSchema = z.object({
	id: z.string(),
	updatedAt: z.union([z.string(), z.date()]),
	createdAt: z.union([z.string(), z.date()]),
	questionId: z.string(),
	position: z.number(),
	question: z.string(),
	options: z.preprocess(
		(obj) => cleanNullVal(obj as Record<string, string>),
		z.record(z.string(), z.string()),
	),
	ans: z.string(),
	translation: z.record(z.string(), z.string().nullable().optional()),
});

export const QuestionWithSubsSchema = QuestionSchema.extend({
	subs: z.array(SubQuestionSchema),
});

export type Question = z.infer<typeof QuestionSchema>;
export type SubQuestion = z.infer<typeof SubQuestionSchema>;
export type QuestionWithSubs = z.infer<typeof QuestionWithSubsSchema>;
