import z from "zod";

export const VocabularyCategorySchema = z.object({
	name: z.string(),
	slug: z.string(),
	alias: z.string().nullable().optional(),
	level: z.number(),
	totalWords: z.number().optional(),
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
});

export type VocabularyCategory = z.infer<typeof VocabularyCategorySchema>;
export type Vocabulary = z.infer<typeof VocabularySchema>;
