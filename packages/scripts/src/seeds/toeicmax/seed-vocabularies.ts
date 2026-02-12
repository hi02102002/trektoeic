import fs from "node:fs";
import path from "node:path";
import { db, sql, vocabularies, vocabularyCategories } from "@trektoeic/db";

type ToeicVocab = {
	name: string;
	example: string;
	meaning: string;
	spelling: string;
	type: string;
	loai: string;
	image: string;
	collection: unknown;
};

type ToeicChildCategory = {
	vocabs?: ToeicVocab[];
};

type ToeicRootCategory = {
	name: string;
	slug: string;
	alias?: string | null;
	has_child?: number | boolean;
	vocabs?: ToeicVocab[];
	childs?: ToeicChildCategory[];
};

type VocabularyCollection = {
	uk?: { spell: string; sound: string };
	us?: { spell: string; sound: string };
} | null;

const normalizeCollection = (value: unknown): VocabularyCollection => {
	if (value != null && typeof value === "object" && !Array.isArray(value)) {
		return value as Exclude<VocabularyCollection, null>;
	}
	return null;
};

const main = async () => {
	const data = fs.readFileSync(
		path.join(process.cwd(), "/data/toeicmax-vocabs.json"),
		"utf-8",
	);
	const parsed = JSON.parse(data) as ToeicRootCategory[];

	await db.delete(vocabularyCategories).where(sql`true`);
	await db.delete(vocabularies).where(sql`true`);

	console.log("Seeding TOEIC Max vocabularies...");

	await db.transaction(async (tx) => {
		for (const item of parsed) {
			const [parentCategory] = await tx
				.insert(vocabularyCategories)
				.values({
					name: item.name,
					slug: item.slug,
					alias: item.alias,
					level: 1,
					hasChild: false,
				})
				.returning({
					id: vocabularyCategories.id,
				});

			console.log(`Inserted category: ${parentCategory?.id} - ${item.name}`);

			if (!parentCategory) throw new Error("Failed to insert parent category");

			const rootVocabs: ToeicVocab[] = [...(item.vocabs ?? [])];

			// Flatten all child lesson vocabularies into the root category.
			if (item.has_child && item.childs) {
				for (const child of item.childs) {
					if (child.vocabs && child.vocabs.length > 0) {
						rootVocabs.push(...child.vocabs);
					}
				}
			}

			if (rootVocabs.length > 0) {
				await tx.insert(vocabularies).values(
					rootVocabs.map((vocab) => ({
						categoryId: parentCategory.id,
						name: vocab.name,
						example: vocab.example,
						meaning: vocab.meaning,
						spelling: vocab.spelling,
						type: vocab.type,
						detailType: vocab.loai,
						image: vocab.image,
						collection: normalizeCollection(vocab.collection),
					})),
				);
			}

			console.log(`  Added ${rootVocabs.length} vocabularies to ${item.name}`);
		}
	});
};

main().catch((err) => {
	console.error("❌ Error seeding TOEIC Max vocabularies:", err);
	process.exit(1);
});
