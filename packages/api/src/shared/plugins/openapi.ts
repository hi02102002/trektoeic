import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import type { Context } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

export const openapi = <T extends Context>() => {
	return new OpenAPIReferencePlugin<T>({
		schemaConverters: [new ZodToJsonSchemaConverter()],
		specGenerateOptions: {
			info: {
				title: "TrekToeic API",
				version: "1.0.0",
				description: "API documentation for the TrekToeic application",
			},
		},
	});
};
