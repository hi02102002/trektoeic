import z from "zod";

export const KitSchema = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	year: z.number(),
	updatedAt: z.union([z.string(), z.date()]),
	createdAt: z.union([z.string(), z.date()]),
});

export type Kit = z.infer<typeof KitSchema>;
