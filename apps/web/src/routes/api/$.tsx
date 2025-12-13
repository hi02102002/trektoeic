import "@trektoeic/api/polyfill";

import { createFileRoute } from "@tanstack/react-router";
import { createContext } from "@trektoeic/api/context";
import { appRouter } from "@trektoeic/api/routers/index";
import { createOpenApiHandler } from "@trektoeic/api/shared/handlers";

const handler = createOpenApiHandler(appRouter);

export const Route = createFileRoute("/api/$")({
	server: {
		handlers: {
			ANY: async ({ request }) => {
				const { response } = await handler.handle(request, {
					prefix: "/api",
					context: await createContext({ req: request }),
				});

				return response ?? new Response("Not found", { status: 404 });
			},
		},
	},
});
