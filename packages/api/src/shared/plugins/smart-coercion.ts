import { SmartCoercionPlugin } from "@orpc/json-schema";
import type { Context } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

export const smartCoercion = <T extends Context>(): SmartCoercionPlugin<T> => {
	return new SmartCoercionPlugin<T>({
		schemaConverters: [new ZodToJsonSchemaConverter()],
	});
};
