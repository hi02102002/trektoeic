import { createFileRoute } from "@tanstack/react-router";

const baseUrl = "https://trektoeic.io.vn";

interface SitemapUrl {
	loc: string;
	lastmod?: string;
	changefreq?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
	priority?: number;
}

const urls: SitemapUrl[] = [
	{
		loc: "/",
		changefreq: "daily",
		priority: 1.0,
	},
	{
		loc: "/about",
		changefreq: "monthly",
		priority: 0.8,
	},
];

function generateSitemapXml(urlList: SitemapUrl[]): string {
	const urlEntries = urlList
		.map((url) => {
			const entries = ["<url>", `  <loc>${baseUrl}${url.loc}</loc>`];

			if (url.lastmod) {
				entries.push(`  <lastmod>${url.lastmod}</lastmod>`);
			}

			if (url.changefreq) {
				entries.push(`  <changefreq>${url.changefreq}</changefreq>`);
			}

			if (url.priority !== undefined) {
				entries.push(`  <priority>${url.priority}</priority>`);
			}

			entries.push("</url>");
			return entries.join("\n");
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: () => {
				const sitemap = generateSitemapXml(urls);

				return new Response(sitemap, {
					headers: {
						"Content-Type": "application/xml",
						"Cache-Control": "public, max-age=3600, s-maxage=3600",
					},
				});
			},
		},
	},
});
