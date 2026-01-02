import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const QuerySchema = z.object({
	title: z
		.string()
		.optional()
		.default("TrekToeic – An effective online platform for TOEIC preparation"),
});

export const Route = createFileRoute("/og.png")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const query = QuerySchema.parse(Object.fromEntries(url.searchParams));

				const title =
					query.title.length > 100
						? `${query.title.slice(0, 100)}...`
						: query.title;

				const ogRes = await fetch("https://ogimage.click/api/v1/images", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: "og:image-right",
						params: {
							tag: {
								text: "trektoeic.io.vn",
								fontFamily: "inter",
								fontWeight: 400,
								fontSize: 20,
								color: "#030712",
							},
							title: {
								text: title,
								fontFamily: "inter",
								fontWeight: 700,
								fontSize: 60,
								color: "#030712",
							},
							logo: {
								url: "https://trektoeic.io.vn/favicon-192x192.png",
							},
							image: {
								url: "https://trektoeic.io.vn/og-image.png",
							},
						},
						background: {
							type: "linear-gradient",
							direction: "to top right",
							colorStops: [
								"rgb(236, 72, 153)",
								"rgb(239, 68, 68)",
								"rgb(234, 179, 8)",
							],
							noise: 0.15,
							gridOverlay: {
								pattern: "grid",
								color: "#f9fafb",
								opacity: 0.4,
								blurRadius: 20,
							},
						},
						canvas: {
							width: 1200,
							height: 630,
						},
					}),
				});

				if (!ogRes.ok || !ogRes.body) {
					const text = await ogRes.text();
					return new Response(text, {
						status: ogRes.status,
					});
				}

				return new Response(ogRes.body, {
					status: 200,
					headers: {
						"Content-Type": "image/png",
						"Cache-Control": "public, max-age=31536000, immutable",
						"CDN-Cache-Control": "max-age=31536000",
					},
				});
			},
		},
	},
});
