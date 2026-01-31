import * as cheerio from "cheerio";
import { api } from "../api";

type HistoryItem = {
	title: string;
	link: string;
	page: number;
};

const REQUIRED_PARTS = [
	"Part 1",
	"Part 2",
	"Part 3",
	"Part 4",
	"Part 5",
	"Part 6",
	"Part 7",
];

export const getAllHistories = async () => {
	let page = 1;
	let hasNextPage = true;

	const results: HistoryItem[] = [];

	do {
		console.log(`Fetching histories - Page ${page}...`);

		const html = await api
			.get("/my-account/tests/", { params: { page } })
			.then((res) => res.data);

		const $ = cheerio.load(html);

		$(".user-test").each((_, userTestEl) => {
			const title = $(userTestEl).find("h2.h5").first().text().trim();

			let foundForThisTitle = false;

			$(userTestEl)
				.find("tbody tr")
				.each((_, row) => {
					if (foundForThisTitle) return false; // ⛔ stop nếu đã có link

					const parts = new Set<string>();

					$(row)
						.find(".result-badge-practice")
						.each((_, el) => {
							const text = $(el).text().trim();
							if (text.startsWith("Part")) {
								parts.add(text);
							}
						});

					const hasAllParts = REQUIRED_PARTS.every((p) => parts.has(p));
					if (!hasAllParts) return;

					const link = $(row).find('a[href*="/results/"]').attr("href");

					if (!link) return;

					results.push({
						title,
						link,
						page,
					});

					foundForThisTitle = true;
					return false; // 🚨 BREAK tbody tr
				});
		});

		hasNextPage =
			$(".pagination .page-item:not(.disabled) .fa-chevron-right").length > 0;

		page++;

		console.log(`Found ${results.length} histories so far...`);
	} while (hasNextPage);

	return results;
};
