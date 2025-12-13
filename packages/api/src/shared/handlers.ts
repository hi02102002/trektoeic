import { OpenAPIHandler } from "@orpc/openapi/fetch";
import {
	type Context,
	type ContractRouter,
	onError,
	type Router,
} from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import {
	cors,
	csrfProtection,
	logger,
	openapi,
	responseHeader,
	smartCoercion,
} from "./plugins";
import { batchHandler } from "./plugins/batch-handler";

// biome-ignore lint/suspicious/noExplicitAny: it is needed here
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
		// biome-ignore lint/suspicious/noTsIgnore: orpc types issue
		// @ts-ignore
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
		csrfProtection(),
		responseHeader(),
	].filter((p) => p !== null);

	return new OpenAPIHandler(router, {
		interceptors: [
			onError((error) => {
				console.error(error);
			}),
		],
		// biome-ignore lint/suspicious/noTsIgnore: orpc types issue
		// @ts-ignore
		plugins,
	});
};
