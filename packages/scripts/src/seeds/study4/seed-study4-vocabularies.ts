// with-script src/seeds/study4/seed-study4-vocabularies.ts
// Reads vocabularies.json (from crawler data or --path).
// Seeds root + sub-topic categories and preserves nested vocabulary mapping.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db, sql, vocabularies, vocabularyCategories } from "@trektoeic/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// From packages/scripts/src/seeds/study4 -> packages/crawler/src/data
const DEFAULT_JSON_PATH = path.join(
	__dirname,
	"../../../../crawler/src/data/vocabularies.json",
);

type VocabItem = {
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
};

type VocabulariesSubTopic = {
	topicId: number;
	title: string;
	categoryId: string;
	vocabularies: VocabItem[];
};

type VocabulariesByTopic = {
	topicId: number;
	title: string;
	categoryId: string;
	/** Leaf: direct vocabularies. Có khi có subTopics thì không có. */
	vocabularies?: VocabItem[];
	/** Parent: sub-topics từ crawl. Có thì dùng làm level 2, không chunk. */
	subTopics?: VocabulariesSubTopic[];
};

const CHUNK_SIZE = 12;

const slugify = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-{2,}/g, "-");

const toChunks = <T>(items: T[], size: number): T[][] => {
	const chunks: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size));
	}
	return chunks;
};

const main = async () => {
	const jsonPath =
		process.argv[2] ?? process.env.VOCABULARIES_JSON ?? DEFAULT_JSON_PATH;
	if (!fs.existsSync(jsonPath)) {
		console.error(`❌ File not found: ${jsonPath}`);
		process.exit(1);
	}

	const data = JSON.parse(
		fs.readFileSync(jsonPath, "utf-8"),
	) as VocabulariesByTopic[];

	console.log("Seeding STUDY4 vocabularies (chunked nested categories)...");

	await db.delete(vocabularies).where(sql`true`);
	await db.delete(vocabularyCategories).where(sql`true`);

	await db.transaction(async (tx) => {
		for (const item of data) {
			const allVocabs = [
				...(item.vocabularies ?? []),
				...(item.subTopics ?? []).flatMap((sub) => sub.vocabularies ?? []),
			];
			const vocabChunks = toChunks(allVocabs, CHUNK_SIZE);

			const [parent] = await tx
				.insert(vocabularyCategories)
				.values({
					name: item.title,
					slug: item.categoryId,
					level: 1,
					hasChild: vocabChunks.length > 0,
				})
				.returning({ id: vocabularyCategories.id });

			if (!parent) throw new Error(`Failed to insert category: ${item.title}`);

			for (const [index, chunk] of vocabChunks.entries()) {
				const chunkNo = index + 1;
				const startIndex = index * CHUNK_SIZE + 1;
				const endIndex = startIndex + chunk.length - 1;
				const chunkTitle = `${item.title} (${startIndex}-${endIndex})`;
				const chunkSlug = `${slugify(item.title)}-${chunkNo}`;
				const [child] = await tx
					.insert(vocabularyCategories)
					.values({
						name: chunkTitle,
						slug: chunkSlug,
						level: 2,
						parentId: parent.id,
						hasChild: false,
					})
					.returning({ id: vocabularyCategories.id });

				if (!child) {
					throw new Error(`Failed to insert chunk category: ${chunkTitle}`);
				}

				if (chunk.length > 0) {
					await tx.insert(vocabularies).values(
						chunk.map((v) => ({
							categoryId: child.id,
							name: v.name,
							example: v.example,
							meaning: v.meaning,
							spelling: v.spelling,
							type: v.type,
							detailType: v.detailType,
							image: v.image,
							collection: v.collection,
						})),
					);
				}

				console.log(
					`  Inserted chunk: ${child.id} - ${chunkTitle} (${chunk.length} vocabs)`,
				);
			}

			console.log(
				`Inserted category: ${parent.id} - ${item.title} (${allVocabs.length} total vocabs)`,
			);
		}
	});

	console.log("✅ Done.");
};

main().catch((err) => {
	console.error("❌ Error seeding STUDY4 vocabularies:", err);
	process.exit(1);
});
