import z from "zod";

export const OrderDirectionSchema = z.enum(["asc", "desc"]);

export const createOrderByInputSchema = <
	TField extends readonly [string, ...string[]],
>(
	fields: TField,
) =>
	z.object({
		field: z.enum(fields),
		direction: OrderDirectionSchema,
	});

export type InferOrderBy<T extends readonly [string, ...string[]]> = z.infer<
	ReturnType<() => ReturnType<typeof createOrderByInputSchema<T>>>
>;

export const PaginationInputSchema = z.object({
	page: z.number().min(1).optional().default(1),
	limit: z.number().min(1).default(10),
});

export const PaginatedResultSchema = <TItem>(itemSchema: z.ZodType<TItem>) =>
	z.object({
		items: z.array(itemSchema),
		pagination: z.object({
			totalItems: z.number(),
			currentPage: z.number(),
			itemsPerPage: z.number(),
			totalPages: z.number(),
			nextPage: z.number().nullable().optional(),
			prevPage: z.number().nullable().optional(),
		}),
	});

export type PaginationInput = z.infer<typeof PaginationInputSchema>;

export type PaginatedResult<TItem> = z.infer<
	ReturnType<typeof PaginatedResultSchema<TItem>>
>;

export const DateLikeSchema = z.union([z.string(), z.date()]);
