// with-script src/seeds/study4/seed-study4-vocabularies.ts
// Reads vocabularies.json (from crawler data or --path).
// If topic has subTopics (crawl từ topic có sub): level 1 parent + level 2 từng sub.
// If topic là leaf (không có sub): level 1 parent + level 2 chunk 50 từ "Parent 1-50", "51-100".

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db, vocabularies, vocabularyCategories } from "@trektoeic/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHUNK_SIZE = 50;

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

function chunk<T>(arr: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < arr.length; i += size) {
		chunks.push(arr.slice(i, i + size));
	}
	return chunks;
}

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

	console.log(
		`Seeding STUDY4 vocabularies (level 1 + level 2: subTopics or chunk ${CHUNK_SIZE})...`,
	);

	await db.transaction(async (tx) => {
		for (const item of data) {
			const [parent] = await tx
				.insert(vocabularyCategories)
				.values({
					name: item.title,
					slug: item.categoryId,
					level: 1,
					hasChild: true,
				})
				.returning({ id: vocabularyCategories.id });

			if (!parent) throw new Error(`Failed to insert category: ${item.title}`);

			const hasSubTopics = item.subTopics && item.subTopics.length > 0;

			if (hasSubTopics && item.subTopics) {
				// Topic có sub từ crawl: level 2 = từng sub (tên + slug từ sub)
				for (const sub of item.subTopics) {
					const subSlug = `${item.categoryId}-${sub.topicId}`;
					const [child] = await tx
						.insert(vocabularyCategories)
						.values({
							name: sub.title,
							slug: subSlug,
							level: 2,
							parentId: parent.id,
							hasChild: false,
						})
						.returning({ id: vocabularyCategories.id });

					if (!child) throw new Error(`Failed to insert sub: ${sub.title}`);

					if (sub.vocabularies.length > 0) {
						await tx.insert(vocabularies).values(
							sub.vocabularies.map((v) => ({
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
				}
				const totalVocabs = item.subTopics.reduce(
					(sum, st) => sum + st.vocabularies.length,
					0,
				);
				console.log(
					`Inserted category: ${parent.id} - ${item.title} (${item.subTopics.length} sub-topics, ${totalVocabs} vocabs)`,
				);
			} else {
				// Topic leaf: chunk 50 từ, level 2 = "Parent 1-50", "51-100"
				const vocabs = item.vocabularies ?? [];
				const chunks = chunk(vocabs, CHUNK_SIZE);

				for (let i = 0; i < chunks.length; i++) {
					const subVocabs = chunks[i];
					if (!subVocabs?.length) continue;
					const start = i * CHUNK_SIZE + 1;
					const end = i * CHUNK_SIZE + subVocabs.length;
					const subName = `${item.title} ${start}-${end}`;
					const subSlug = `${item.categoryId}-${start}-${end}`;

					const [child] = await tx
						.insert(vocabularyCategories)
						.values({
							name: subName,
							slug: subSlug,
							level: 2,
							parentId: parent.id,
							hasChild: false,
						})
						.returning({ id: vocabularyCategories.id });

					if (!child)
						throw new Error(`Failed to insert sub-category: ${subName}`);

					await tx.insert(vocabularies).values(
						subVocabs.map((v) => ({
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
					`Inserted category: ${parent.id} - ${item.title} (${chunks.length} chunks, ${vocabs.length} vocabs)`,
				);
			}
		}
	});

	console.log("✅ Done.");
};

main().catch((err) => {
	console.error("❌ Error seeding STUDY4 vocabularies:", err);
	process.exit(1);
});
