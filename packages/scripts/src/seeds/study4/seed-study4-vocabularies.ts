// with-script src/seeds/study4/seed-study4-vocabularies.ts
// Reads vocabularies.json (from crawler data or --path).
// Seeds root categories only and maps all vocabularies directly to root category.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db, vocabularies, vocabularyCategories } from "@trektoeic/db";

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

	console.log("Seeding STUDY4 vocabularies (root categories only)...");

	await db.transaction(async (tx) => {
		for (const item of data) {
			const [parent] = await tx
				.insert(vocabularyCategories)
				.values({
					name: item.title,
					slug: item.categoryId,
					level: 1,
					hasChild: false,
				})
				.returning({ id: vocabularyCategories.id });

			if (!parent) throw new Error(`Failed to insert category: ${item.title}`);

			const topicVocabs = [
				...(item.vocabularies ?? []),
				...(item.subTopics ?? []).flatMap((sub) => sub.vocabularies ?? []),
			];

			if (topicVocabs.length > 0) {
				await tx.insert(vocabularies).values(
					topicVocabs.map((v) => ({
						categoryId: parent.id,
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
				`Inserted category: ${parent.id} - ${item.title} (${topicVocabs.length} vocabs)`,
			);
		}
	});

	console.log("✅ Done.");
};

main().catch((err) => {
	console.error("❌ Error seeding STUDY4 vocabularies:", err);
	process.exit(1);
});
