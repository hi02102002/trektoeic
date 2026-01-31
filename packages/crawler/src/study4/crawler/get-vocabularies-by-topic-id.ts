import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createId } from "@trektoeic/utils/create-id";
import * as cheerio from "cheerio";
import { api } from "../api";
import { getFlashcardsListUrl } from "../constant";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://study4.com";

/** Youdao dict voice: type=1 UK, type=2 US. https://dict.youdao.com/dictvoice?audio=hello */
const YOUDAO_VOICE_BASE = "https://dict.youdao.com/dictvoice";

function buildCollectionForWord(word: string): CrawledVocabulary["collection"] {
	const lower = word.toLowerCase();
	const audio = encodeURIComponent(lower);
	return {
		uk: {
			spell: lower,
			sound: `${YOUDAO_VOICE_BASE}?audio=${audio}&type=1`,
		},
		us: {
			spell: lower,
			sound: `${YOUDAO_VOICE_BASE}?audio=${audio}&type=2`,
		},
	};
}

/** Vocabulary-shaped record for crawled data (matches Vocabulary schema). */
export type CrawledVocabulary = {
	id: string;
	categoryId: string;
	name: string;
	example: string;
	meaning: string;
	spelling: string;
	type: string;
	detailType: string;
	image: string;
	collection: {
		uk: { spell: string; sound: string };
		us: { spell: string; sound: string };
	} | null;
	updatedAt: string;
	createdAt: string;
};

function toIsoString() {
	return new Date().toISOString();
}

/**
 * Parses HTML from a topic detail page (e.g. https://study4.com/flashcards/lists/1835/)
 * and returns vocabularies with fields matching Vocabulary schema.
 */
export function parseVocabulariesFromHtml(
	html: string,
	categoryId: string,
): CrawledVocabulary[] {
	const $ = cheerio.load(html);
	const list: CrawledVocabulary[] = [];
	const now = toIsoString();

	$(".termlist-item.contentblock").each((_, el) => {
		const $item = $(el);
		const $h2 = $item.find("h2.h3").first();
		const rawTitle = $h2.text().trim();
		// Strip pronunciation /.../ and take part before "(type)"; collapse whitespace
		const withoutPronunciation = rawTitle
			.replace(/\s*\/[^/]+\/?\s*/g, "")
			.trim();
		const name = (withoutPronunciation.split(/\s*\(/)[0] ?? "")
			.replace(/\s+/g, " ")
			.trim();
		if (!name) return;

		const $spans = $h2.find("span");
		const typeSpan = $spans.filter((_, s) =>
			/^\(.+\)$/.test($(s).text().trim()),
		);
		const typeText =
			typeSpan
				.first()
				.text()
				.trim()
				.replace(/^\(|\)$/g, "") || "";
		const spellingSpan = $spans.filter((_, s) =>
			/^\/.+\/$/.test($(s).text().trim()),
		);
		const spelling = spellingSpan.first().text().trim() || "";

		const meaning = $item.find(".prewrap").first().text().trim();

		const exampleLi = $item.find(".termlist-item-examples li");
		const example = exampleLi
			.map((_, li) => $(li).text().trim())
			.get()
			.filter(Boolean)
			.join("\n");

		const $img = $item.find(".termlist-item-images img").first();
		const imgSrc = $img.attr("data-src") ?? $img.attr("src") ?? "";
		const image = imgSrc.startsWith("http")
			? imgSrc
			: imgSrc
				? `${BASE_URL}${imgSrc.startsWith("/") ? imgSrc : `/${imgSrc}`}`
				: "";

		list.push({
			id: createId(),
			categoryId,
			name,
			example,
			meaning,
			spelling,
			type: typeText,
			detailType: typeText,
			image,
			collection: buildCollectionForWord(name),
			updatedAt: now,
			createdAt: now,
		});
	});

	return list;
}

const DISCOVER_LAST_PAGE = 999;
const LISTS_PATH_REGEX = /\/flashcards\/lists\/(\d+)\/?/;

/** Sub-topic parsed from parent topic page (grid). */
export type SubTopicItem = { id: number; title: string };

/**
 * Parses sub-topics (id + title) from a topic page that shows a grid of sub-topics (like discover).
 * Same structure as get-all-topics: .termlist-grid-item with a[href*="/flashcards/lists/"].
 */
function parseSubTopicsFromHtml(html: string): SubTopicItem[] {
	const $ = cheerio.load(html);
	const items: SubTopicItem[] = [];
	$(".termlist-grid-item").each((_, el) => {
		const $item = $(el);
		const href = $item
			.find('a[href*="/flashcards/lists/"]')
			.first()
			.attr("href");
		const title = $item.find(".termlist-grid-item-title").first().text().trim();
		const raw = href?.match(LISTS_PATH_REGEX)?.[1];
		if (!raw || !title) return;
		const id = Number.parseInt(raw, 10);
		if (!Number.isNaN(id)) items.push({ id, title });
	});
	return items;
}

/**
 * Parses max page number from pagination HTML (nav.jqpages). Used after requesting ?page=999.
 */
function parseMaxPageFromHtml(html: string): number {
	const $ = cheerio.load(html);
	let maxPage = 1;
	$("nav.jqpages .pagination .page-item a.page-link").each((_, el) => {
		const href = $(el).attr("href");
		const match = href?.match(/[?&]page=(\d+)/);
		const raw = match?.[1];
		const n = raw ? Number.parseInt(raw, 10) : 0;
		if (!Number.isNaN(n) && n > maxPage) maxPage = n;
	});
	return maxPage;
}

/** Result when topic has sub-topics (level 2). */
export type TopicCrawlResultParent = {
	isParent: true;
	subTopics: Array<{
		topicId: number;
		title: string;
		categoryId: string;
		vocabularies: CrawledVocabulary[];
	}>;
};

/** Result when topic is leaf (direct vocabularies). */
export type TopicCrawlResultLeaf = {
	isParent: false;
	vocabularies: CrawledVocabulary[];
};

export type TopicCrawlResult = TopicCrawlResultParent | TopicCrawlResultLeaf;

/**
 * Fetches vocabularies for a topic. If the topic page has sub-topics, returns each sub-topic with its vocabularies (level 2). Otherwise returns leaf vocabularies.
 */
export async function getVocabulariesByTopicId(
	topicId: number,
	categoryId: string,
	options?: { delayBetweenPagesMs?: number },
): Promise<TopicCrawlResult> {
	const baseUrl = getFlashcardsListUrl(topicId);
	const delayMs = options?.delayBetweenPagesMs ?? 300;

	// Fetch first page to detect: sub-topics grid vs vocabulary list
	const { data: firstHtml } = await api.get<string>(baseUrl, {
		params: { page: 1 },
		responseType: "text",
	});
	const subTopicsFromPage = parseSubTopicsFromHtml(firstHtml);

	if (subTopicsFromPage.length > 0) {
		// Parent topic: return each sub-topic with its vocabularies (preserve hierarchy)
		const subTopics: TopicCrawlResultParent["subTopics"] = [];
		for (let i = 0; i < subTopicsFromPage.length; i++) {
			const sub = subTopicsFromPage[i];
			if (!sub) continue;
			if (i > 0) await new Promise((r) => setTimeout(r, delayMs));
			const result = await getVocabulariesByTopicId(
				sub.id,
				String(sub.id),
				options,
			);
			if (result.isParent) {
				// Flatten: sub has its own sub-topics, merge into one subTopic entry by id/title
				for (const st of result.subTopics) {
					subTopics.push(st);
				}
			} else {
				subTopics.push({
					topicId: sub.id,
					title: sub.title,
					categoryId: String(sub.id),
					vocabularies: result.vocabularies,
				});
			}
		}
		return { isParent: true, subTopics };
	}

	// Leaf topic: page=999 to get max page and last page vocabularies, then pages 1..maxPage-1
	const { data: lastPageHtml } = await api.get<string>(baseUrl, {
		params: { page: DISCOVER_LAST_PAGE },
		responseType: "text",
	});
	const maxPage = parseMaxPageFromHtml(lastPageHtml);
	const all: CrawledVocabulary[] = parseVocabulariesFromHtml(
		lastPageHtml,
		categoryId,
	);

	for (let page = 1; page < maxPage; page++) {
		await new Promise((r) => setTimeout(r, delayMs));
		const { data: html } = await api.get<string>(baseUrl, {
			params: { page },
			responseType: "text",
		});
		all.unshift(...parseVocabulariesFromHtml(html, categoryId));
	}
	all.reverse();
	return { isParent: false, vocabularies: all };
}

/**
 * Parses vocabularies from a local HTML file (saved topic detail page).
 */
export function getVocabulariesFromFile(
	filePath: string,
	categoryId: string,
): CrawledVocabulary[] {
	const html = fs.readFileSync(filePath, "utf-8");
	return parseVocabulariesFromHtml(html, categoryId);
}

/** Sub-topic under a parent (level 2). */
export type VocabulariesSubTopic = {
	topicId: number;
	title: string;
	categoryId: string;
	vocabularies: CrawledVocabulary[];
};

/** Saved shape: topic with either direct vocabularies (leaf) or subTopics (parent). */
export type VocabulariesByTopic = {
	topicId: number;
	title: string;
	categoryId: string;
	/** Leaf: direct vocabularies. Omitted when subTopics present. */
	vocabularies?: CrawledVocabulary[];
	/** Parent: level 2 sub-topics. Omitted when leaf. */
	subTopics?: VocabulariesSubTopic[];
};

function writeVocabulariesToFile(data: VocabulariesByTopic[]): string {
	const baseDir = path.join(__dirname, "..", "..", "data");
	if (!fs.existsSync(baseDir)) {
		fs.mkdirSync(baseDir, { recursive: true });
	}
	const outputPath = path.join(baseDir, "vocabularies.json");
	fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
	console.log(`Vocabularies saved to ${outputPath}`);
	return outputPath;
}

/**
 * Crawls vocabularies for all topics in the given list and saves to data/vocabularies.json.
 * Topics with sub-topics are saved with subTopics (level 2); leaf topics with vocabularies.
 */
export async function crawlAllVocabularies(
	topicsJsonPath: string,
	options?: { delayMs?: number },
): Promise<VocabulariesByTopic[]> {
	const delayMs = options?.delayMs ?? 500;
	const topics = JSON.parse(fs.readFileSync(topicsJsonPath, "utf-8")) as Array<{
		id: number;
		title: string;
	}>;

	const results: VocabulariesByTopic[] = [];

	for (let i = 0; i < topics.length; i++) {
		const topic = topics[i];
		if (!topic) continue;
		const categoryId = String(topic.id);
		console.log(
			`[${i + 1}/${topics.length}] Fetching vocabularies for: ${topic.title} (${topic.id})`,
		);
		const result = await getVocabulariesByTopicId(topic.id, categoryId, {
			delayBetweenPagesMs: 300,
		});
		if (result.isParent) {
			const totalVocabs = result.subTopics.reduce(
				(sum, st) => sum + st.vocabularies.length,
				0,
			);
			results.push({
				topicId: topic.id,
				title: topic.title,
				categoryId,
				subTopics: result.subTopics,
			});
			console.log(
				`  -> ${result.subTopics.length} sub-topics, ${totalVocabs} vocabularies`,
			);
		} else {
			results.push({
				topicId: topic.id,
				title: topic.title,
				categoryId,
				vocabularies: result.vocabularies,
			});
			console.log(`  -> ${result.vocabularies.length} vocabularies`);
		}
		if (i < topics.length - 1) {
			await new Promise((r) => setTimeout(r, delayMs));
		}
	}

	writeVocabulariesToFile(results);
	return results;
}
