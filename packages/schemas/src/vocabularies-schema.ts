import z from "zod";
import { VocabularyReviewStateSchema } from "./vocabularies-shared-schema";

export const VocabularyCategorySchema = z.object({
	name: z.string(),
	slug: z.string(),
	alias: z.string().nullable().optional(),
	level: z.number(),
	totalWords: z.number().optional(),
	dueWords: z.number().optional(),
	learnedWords: z.number().optional(),
	progressPct: z.number().optional(),
	parentId: z.string().nullable().optional(),
	hasChild: z.boolean().optional(),
	id: z.string(),
	updatedAt: z.union([z.string(), z.date()]),
	createdAt: z.union([z.string(), z.date()]),
});

export const VocabularySchema = z.object({
	categoryId: z.string(),
	name: z.string(),
	example: z.string(),
	meaning: z.string(),
	spelling: z.string(),
	type: z.string(),
	detailType: z.string(),
	image: z.string(),
	collection: z
		.object({
			uk: z.object({
				spell: z.string(),
				sound: z.string(),
			}),
			us: z.object({
				spell: z.string(),
				sound: z.string(),
			}),
		})
		.nullable()
		.optional(),
	id: z.string(),
	updatedAt: z.union([z.string(), z.date()]),
	createdAt: z.union([z.string(), z.date()]),
	state: z.preprocess((val) => {
		if (typeof val === "string") {
			if (VocabularyReviewStateSchema.safeParse(val).success) {
				return val;
			}
		}
		return "new";
	}, VocabularyReviewStateSchema),
});

export type VocabularyCategory = z.infer<typeof VocabularyCategorySchema>;
export type Vocabulary = z.infer<typeof VocabularySchema>;
