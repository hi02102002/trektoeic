// with-script src/seeds/study4/seed-tags.ts

import {
	db,
	eq,
	kits,
	questions,
	questionsToTags,
	sql,
	subQuestions,
	tags,
} from "@trektoeic/db";
import fs from "fs";
import { chunk, flatMap, uniqBy } from "lodash-es";
import path from "path";

const main = async () => {
	console.log("🚀 Starting seed process (Pre-parsed mode)...");

	const data = fs.readFileSync(
		path.join(process.cwd(), "/data/all-tags.json"),
		"utf-8",
	);
	const jsonData = JSON.parse(data);

	// ===========================================
	// PHASE 1: INSERT TAGS
	// ===========================================
	console.log("📦 Phase 1: Processing Tags...");

	const allTags = flatMap(jsonData, "tags");

	const uniqueTags = uniqBy(allTags, "key");

	const tagsToInsert = uniqueTags.map((tag: any) => ({
		key: tag.key, // Dùng trực tiếp key đã có
		groupKey: tag.groupKey, // Dùng trực tiếp groupKey
		part: tag.part, // Dùng trực tiếp part (int hoặc null)
		labelVi: tag.name, // Label hiển thị
		// labelEn: tag.labelEn || null, // Nếu có
	}));

	if (tagsToInsert.length > 0) {
		const chunks = chunk(tagsToInsert, 100);
		for (const batch of chunks) {
			await db
				.insert(tags)
				.values(batch)
				.onConflictDoUpdate({
					target: tags.key,
					set: {
						labelVi: sql`EXCLUDED.label_vi`,
						groupKey: sql`EXCLUDED.group_key`,
						part: sql`EXCLUDED.part`,
					},
				});
		}
		console.log(`✅ Inserted/Updated ${tagsToInsert.length} tags.`);
	}

	// ===========================================
	// PHASE 2: LINKING QUESTIONS TO TAGS
	// ===========================================
	console.log("🔗 Phase 2: Linking Questions to Tags...");

	// 1. Load lại Tags từ DB để lấy UUID (ID thật trong database)
	const allDbTags = await db.select({ id: tags.id, key: tags.key }).from(tags);

	// Tạo Map: Key (string) -> ID (UUID)
	const tagMap = new Map<string, string>();
	allDbTags.forEach((t) => {
		tagMap.set(t.key, t.id);
	});

	let totalLinks = 0;
	const linksToInsert: { questionId: string; tagId: string }[] = [];

	for (const test of jsonData) {
		const kitName = test.title;

		const foundKit = await db.query.kits.findFirst({
			where: eq(kits.name, kitName),
			columns: { id: true },
		});

		if (!foundKit) {
			console.warn(`⚠️ Kit not found: "${kitName}". Skipping...`);
			continue;
		}

		const kitSubQuestions = await db
			.select({
				subId: subQuestions.id,
				pos: subQuestions.position,
			})
			.from(subQuestions)
			.innerJoin(questions, eq(subQuestions.questionId, questions.id))
			.where(eq(questions.kitId, foundKit.id));

		const questionPosMap = new Map<number, string>();
		kitSubQuestions.forEach((q) => {
			questionPosMap.set(q.pos, q.subId);
		});

		for (const tagItem of test.tags) {
			const tagKey = tagItem.key;
			const tagId = tagMap.get(tagKey);

			if (!tagId) {
				continue;
			}

			if (Array.isArray(tagItem.questions)) {
				for (const pos of tagItem.questions) {
					const subQuestionId = questionPosMap.get(pos);

					if (subQuestionId) {
						linksToInsert.push({
							questionId: subQuestionId,
							tagId: tagId,
						});
					}
				}
			}
		}
	}

	const uniqueLinks = uniqBy(
		linksToInsert,
		(l) => `${l.questionId}_${l.tagId}`,
	);

	console.log(`Preparing to insert ${uniqueLinks.length} links...`);

	if (uniqueLinks.length > 0) {
		const linkChunks = chunk(uniqueLinks, 500);
		for (const batch of linkChunks) {
			await db.insert(questionsToTags).values(batch).onConflictDoNothing();

			totalLinks += batch.length;
		}
	}

	console.log(`🏁 Finished! Total links processed: ${totalLinks}`);
	process.exit(0);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
