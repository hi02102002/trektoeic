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
	name: string;
	slug: string;
	alias?: string | null;
	has_child?: number | boolean;
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

	await db.delete(vocabularies).where(sql`true`);
	await db.delete(vocabularyCategories).where(sql`true`);

	console.log("Seeding TOEIC Max vocabularies...");

	await db.transaction(async (tx) => {
		for (const item of parsed) {
			const hasChildCategories =
				Array.isArray(item.childs) && item.childs.length > 0;
			const [parentCategory] = await tx
				.insert(vocabularyCategories)
				.values({
					name: item.name,
					slug: item.slug,
					alias: item.alias,
					level: 1,
					hasChild: hasChildCategories || Boolean(item.has_child),
				})
				.returning({
					id: vocabularyCategories.id,
				});

			console.log(`Inserted category: ${parentCategory?.id} - ${item.name}`);

			if (!parentCategory) throw new Error("Failed to insert parent category");

			const rootVocabs: ToeicVocab[] = [...(item.vocabs ?? [])];

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

			if (hasChildCategories) {
				for (const child of item.childs ?? []) {
					const [childCategory] = await tx
						.insert(vocabularyCategories)
						.values({
							name: child.name,
							slug: child.slug,
							alias: child.alias,
							level: 2,
							parentId: parentCategory.id,
							hasChild: Boolean(child.has_child),
						})
						.returning({
							id: vocabularyCategories.id,
						});

					if (!childCategory) {
						throw new Error(
							`Failed to insert child category for parent: ${item.name}`,
						);
					}

					const childVocabs = child.vocabs ?? [];
					if (childVocabs.length > 0) {
						await tx.insert(vocabularies).values(
							childVocabs.map((vocab) => ({
								categoryId: childCategory.id,
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

					console.log(
						`  Added ${childVocabs.length} vocabularies to ${item.name} > ${child.name}`,
					);
				}
			}

			console.log(
				`  Added ${rootVocabs.length} direct vocabularies to ${item.name}`,
			);
		}
	});
};

main().catch((err) => {
	console.error("❌ Error seeding TOEIC Max vocabularies:", err);
	process.exit(1);
});
