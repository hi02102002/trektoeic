import { z } from "zod";

export const PartSchema = z.coerce.number().min(1).max(7);

export const PartSectionSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	part: PartSchema,
	title: z.string().nullable(),
	titleVi: z.string().nullable(),
	sectionTitle: z.string().nullable(),
	sectionDes: z.string().nullable(),
	intro: z.string().nullable(),
	introVi: z.string().nullable(),
	introAudio: z.string().nullable(),
	introImage: z.string().nullable(),
	introAnswer: z.string().nullable(),
});
export type PartSection = z.infer<typeof PartSectionSchema>;
export type Part = z.infer<typeof PartSchema>;
