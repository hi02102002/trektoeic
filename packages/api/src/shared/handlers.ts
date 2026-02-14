import { OpenAPIHandler } from "@orpc/openapi/fetch";
import {
	type Context,
	type ContractRouter,
	ORPCError,
	onError,
	type Router,
} from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import z, { ZodError } from "zod";
import {
	cors,
	logger,
	openapi,
	responseHeader,
	smartCoercion,
} from "./plugins";
import { batchHandler } from "./plugins/batch-handler";

type AnyRouter<T extends Context> = Router<ContractRouter<any>, T>;

export const createRpcHandler = <T extends Context>(router: AnyRouter<T>) => {
	const plugins = [
		cors(),
		logger(),
		batchHandler(),
		smartCoercion<T>(),
		responseHeader(),
	].filter((p) => p !== null);
	return new RPCHandler(router, {
		interceptors: [
			onError((error) => {
				console.error(error);
			}),
		],
		plugins,
	});
};

export const createOpenApiHandler = <T extends Context>(
	router: AnyRouter<T>,
) => {
	const plugins = [
		cors(),
		openapi(),
		smartCoercion<T>(),
		logger(),
		responseHeader(),
		batchHandler(),
	].filter((p) => p !== null);

	return new OpenAPIHandler(router, {
		interceptors: [
			onError((error) => {
				if (error instanceof ZodError) {
					throw new ORPCError("VALIDATION_ERROR", {
						status: 400,
						message: z.prettifyError(error),
						data: z.flattenError(error),
						cause: error.cause,
					});
				}

				throw error;
			}),
		],
		plugins,
	});
};
