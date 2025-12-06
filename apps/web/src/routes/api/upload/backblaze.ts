import { createFileRoute } from "@tanstack/react-router";
import { backblazeRouter, betterUploadServer } from "@trektoiec/uploads";

export const Route = createFileRoute("/api/upload/backblaze")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				return betterUploadServer.handleRequest(request, backblazeRouter);
			},
		},
	},
});
