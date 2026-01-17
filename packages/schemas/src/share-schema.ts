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
