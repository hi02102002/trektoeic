import { createFileRoute } from "@tanstack/react-router";
import {
	backblazeRouter,
	betterUploadServer,
	cloudflareRouter,
} from "@trektoiec/uploads";

export const Route = createFileRoute("/api/upload/cloudflare")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				return betterUploadServer.handleRequest(request, cloudflareRouter);
			},
		},
	},
});
