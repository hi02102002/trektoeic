import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

export const openapi = () => {
	return new OpenAPIReferencePlugin({
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
