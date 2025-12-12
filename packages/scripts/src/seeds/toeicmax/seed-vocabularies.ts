import { db, sql, vocabularies, vocabularyCategories } from "@trektoeic/db";
import fs from "fs";
import path from "path";

const main = async () => {
	const data = fs.readFileSync(
		path.join(process.cwd(), "/data/toeicmax-vocabs.json"),
		"utf-8",
	);
	const parsed = JSON.parse(data);

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
					level: item.level,
					hasChild: Boolean(item.has_child),
				})
				.returning({
					id: vocabularyCategories.id,
				});

			console.log(`Inserted category: ${parentCategory?.id} - ${item.name}`);

			if (!parentCategory) throw new Error("Failed to insert parent category");

			// Insert child categories (lessons) and their vocabularies
			if (item.has_child && item.childs) {
				for (const child of item.childs) {
					const [childCategory] = await tx
						.insert(vocabularyCategories)
						.values({
							name: child.name,
							slug: child.slug,
							alias: child.alias,
							level: child.level,
							parentId: parentCategory.id,
							hasChild: Boolean(child.has_child),
						})
						.returning({
							id: vocabularyCategories.id,
						});

					console.log(
						`  Inserted lesson: ${childCategory?.id} - ${child.name} (${child.counts} vocabs)`,
					);

					if (!childCategory)
						throw new Error("Failed to insert child category");

					if (child.vocabs && child.vocabs.length > 0) {
						await tx.insert(vocabularies).values(
							child.vocabs.map((vocab: any) => ({
								categoryId: childCategory.id,
								name: vocab.name,
								example: vocab.example,
								meaning: vocab.meaning,
								spelling: vocab.spelling,
								type: vocab.type,
								detailType: vocab.loai,
								image: vocab.image,
								collection: vocab.collection,
							})),
						);
					}
				}
			}
		}
	});
};

main().catch((err) => {
	console.error("❌ Error seeding TOEIC Max vocabularies:", err);
	process.exit(1);
});
