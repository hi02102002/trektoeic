import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createContext } from "@trektoeic/api/context";
import { appRouter } from "@trektoeic/api/routers/index";

const getORPCClient = createIsomorphicFn()
	.server(() => {
		return createRouterClient(appRouter, {
			context: async ({ req }) => {
				const headers = req?.headers ?? getRequestHeaders();

				return createContext({ headers });
			},
		});
	})
	.client((): RouterClient<typeof appRouter> => {
		const link = new RPCLink({
			url: `${window.location.origin}/api/rpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
		});

		return createORPCClient(link);
	});

export const client: RouterClient<typeof appRouter> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
