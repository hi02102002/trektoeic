import { sleep } from "@trektoeic/utils/sleep";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getAllHistories } from "./get-all-history";
import { getTagsByLink } from "./get-tags-by-link";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getYearAndOrderFromTitle = (title: string) => {
	const match = title.match(/(\d{4}).*?Test\s*(\d+)/i);

	if (!match) return null;

	const year = Number(match[1]);
	const test = Number(match[2]);

	return `Test ${String(test).padStart(2, "0")} ${year}`;
};

export const getAllTags = async () => {
	const baseDir = path.join(__dirname, "..", "..", "data");

	const histories = await getAllHistories();

	const results = [];

	for (const history of histories) {
		console.log(`Fetching tags for: ${history.title}`);

		const tags = await getTagsByLink(history.link);

		await sleep(500);

		results.push({
			tags,
			title: getYearAndOrderFromTitle(history.title) || history.title,
		});

		console.log(`Fetched ${tags.length} tags for: ${history.title}`);
	}

	if (!fs.existsSync(baseDir)) {
		fs.mkdirSync(baseDir, { recursive: true });
	}

	const outputPath = path.join(baseDir, "all-tags.json");
	fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
	console.log(`All tags saved to ${outputPath}`);

	return results;
};
