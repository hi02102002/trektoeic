import z from "zod";

export const DunnoExampleSchema = z.object({
	language: z.string(),
	_id: z.string(),
	e: z.string(),
	p: z.string().nullable(),
	id: z.number(),
	type: z.string(),
	m: z.string(),
});

export const DunnoMeaningSchema = z.object({
	mean: z.string(),
	examples: z.array(DunnoExampleSchema).optional().default([]),
});

export const DunnoContentEntrySchema = z.object({
	kind: z.string(),
	means: z.array(DunnoMeaningSchema),
});

export const DunnoWordFamilySchema = z.object({
	field: z.string().optional(),
	kind: z.string().optional(),
	p: z.array(z.string()).optional().default([]),
	content: z.array(z.string()).optional().default([]),
});

export const DunnoPronounceSchema = z.object({
	gb: z.string().optional(),
	us: z.string().optional(),
	base: z.string().optional(),
});

export const DunnoDictionaryEntrySchema = z.object({
	word_family: z.preprocess(
		(value) => (value == null ? [] : value),
		z.array(DunnoWordFamilySchema),
	),
	language: z.string(),
	word: z.string(),
	freq: z.number().nullable().optional(),
	id: z.number(),
	keyword: z.string().optional(),
	pronounce: DunnoPronounceSchema.nullable().optional(),
	topic: z.unknown().nullable().optional(),
	content: z.preprocess(
		(value) => (value == null ? [] : value),
		z.array(DunnoContentEntrySchema),
	),
	_id: z.string().optional(),
	type: z.string().optional(),
	conjugation: z.unknown().nullable().optional(),
	snym: z.unknown().nullable().optional(),
});

export const DunnoSearchResponseSchema = z.object({
	total: z.number(),
	found: z.boolean(),
	result: z.array(DunnoDictionaryEntrySchema),
});

export type DunnoDictionaryEntry = z.infer<typeof DunnoDictionaryEntrySchema>;
