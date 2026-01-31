import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import { api } from "../api";
import { FLASHCARDS_DISCOVER_URL } from "../constant";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type TopicItem = {
	id: number;
	title: string;
};

const LISTS_PATH_REGEX = /\/flashcards\/lists\/(\d+)\/?/;

/**
 * Parses HTML and extracts topic id and title from each topic card.
 * Use this with HTML from https://study4.com/flashcards/discover/ or a saved file.
 */
export function parseTopicsFromHtml(html: string): TopicItem[] {
	const $ = cheerio.load(html);
	const topics: TopicItem[] = [];

	$(".termlist-grid-item").each((_, el) => {
		const $item = $(el);
		const $link = $item.find('a[href*="/flashcards/lists/"]').first();
		const href = $link.attr("href");
		const title = $item.find(".termlist-grid-item-title").first().text().trim();

		if (!href || !title) return;

		const match = href.match(LISTS_PATH_REGEX);
		const idRaw = match?.[1];
		if (!idRaw) return;

		const id = Number.parseInt(idRaw, 10);
		if (Number.isNaN(id)) return;

		topics.push({ id, title });
	});

	return topics;
}

function writeTopicsToFile(topics: TopicItem[]): string {
	const baseDir = path.join(__dirname, "..", "..", "data");
	if (!fs.existsSync(baseDir)) {
		fs.mkdirSync(baseDir, { recursive: true });
	}
	const outputPath = path.join(baseDir, "all-topics.json");
	fs.writeFileSync(outputPath, JSON.stringify(topics, null, 2), "utf-8");
	console.log(`All topics saved to ${outputPath}`);
	return outputPath;
}

/**
 * Fetches the discover page from study4.com and returns all topic id and title.
 * Writes result to data/all-topics.json.
 */
export async function getAllTopics(): Promise<TopicItem[]> {
	const { data: html } = await api.get<string>(FLASHCARDS_DISCOVER_URL, {
		responseType: "text",
	});
	const topics = parseTopicsFromHtml(html);
	writeTopicsToFile(topics);
	return topics;
}
