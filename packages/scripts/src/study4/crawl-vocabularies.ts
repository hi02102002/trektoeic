// with-script src/study4/crawl-vocabularies.ts

import path from "node:path";
import { fileURLToPath } from "node:url";
import { crawlAllVocabularies } from "@trektoeic/crawler/study4/crawler/get-vocabularies-by-topic-id";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOPICS_JSON_PATH = path.join(
	__dirname,
	"..",
	"..",
	"data",
	"all-study-4-topics.json",
);

const main = async () => {
	await crawlAllVocabularies(TOPICS_JSON_PATH, { delayMs: 500 });
};

main();
