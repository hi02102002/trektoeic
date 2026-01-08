import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { BatchLinkPlugin, DedupeRequestsPlugin } from "@orpc/client/plugins";
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
		const link = new RPCLink<{
			cache?: RequestCache;
		}>({
			url: `${window.location.origin}/api/rpc`,
			method: ({ context }) => {
				if (context?.cache) {
					return "GET";
				}

				return "POST";
			},
			fetch(url, options, { context }) {
				return fetch(url, {
					...options,
					credentials: "include",
					cache: context?.cache,
				});
			},
			plugins: [
				new DedupeRequestsPlugin({
					filter: ({ request }) => request.method === "GET",
					groups: [
						{
							condition: ({ context }) => context?.cache === "force-cache",
							context: {
								cache: "force-cache",
							},
						},
						{
							condition: () => true,
							context: {},
						},
					],
				}),
				new BatchLinkPlugin({
					mode: typeof window === "undefined" ? "buffered" : "streaming",
					groups: [
						{
							condition: ({ context }) => context?.cache === "force-cache",
							context: {
								cache: "force-cache",
							},
						},
						{
							condition: () => true,
							context: {},
						},
					],
				}),
			],
		});

		return createORPCClient(link);
	});

export const client: RouterClient<typeof appRouter> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
