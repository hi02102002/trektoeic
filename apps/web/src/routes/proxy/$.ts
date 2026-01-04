import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/proxy/$")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				try {
					const mediaPath = params._splat || "";

					if (!mediaPath) {
						return new Response("Missing media path", { status: 400 });
					}

					const mediaUrl = `https://api.scandict.com/${mediaPath}`;

					const response = await fetch(mediaUrl, {
						headers: {
							"User-Agent": "Mozilla/5.0",
						},
					});

					if (!response.ok) {
						return new Response("Failed to fetch media", {
							status: response.status,
						});
					}

					const mediaBuffer = await response.arrayBuffer();
					const contentType =
						response.headers.get("content-type") || "application/octet-stream";

					return new Response(mediaBuffer, {
						status: 200,
						headers: {
							"Content-Type": contentType,
							"Cache-Control": "public, max-age=31536000, immutable",
							"Access-Control-Allow-Origin": "*",
							"CDN-Cache-Control": "max-age=31536000",
							"Accept-Ranges": "bytes",
						},
					});
				} catch {
					return new Response("Internal server error", { status: 500 });
				}
			},
		},
	},
});
