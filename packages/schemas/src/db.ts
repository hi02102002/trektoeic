import { type ZodTypeAny, z } from "zod";

export const InsertOrUpdateResult = <T extends ZodTypeAny>(schema: T) =>
	z
		.array(schema)
		.nullish()
		.transform((data) => data?.[0]);
