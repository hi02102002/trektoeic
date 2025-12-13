import "@trektoeic/api/polyfill";

import { createFileRoute } from "@tanstack/react-router";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createContext } from "@trektoeic/api/context";
import { appRouter } from "@trektoeic/api/routers/index";
import { createRpcHandler } from "@trektoeic/api/shared/handlers";

const handler = createRpcHandler(appRouter);

export const Route = createFileRoute("/api/rpc/$")({
	server: {
		handlers: {
			ANY: async ({ request }) => {
				const { response } = await handler.handle(request, {
					prefix: "/api/rpc",
					context: await createContext({
						headers: request?.headers ?? getRequestHeaders(),
					}),
				});

				return response ?? new Response("Not Found", { status: 404 });
			},
		},
	},
});
