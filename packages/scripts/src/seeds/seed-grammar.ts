// with-script packages/scripts/src/seeds/seed-grammar.ts
//
// Mặc định: data/grammar-courses.json (định dạng GrammarSeedFile).
// ToeicMax dump: thêm --toeicmax (đọc data/toiecmax-courses.json theo mặc định).
//
// Biến môi trường (tùy chọn):
// - GRAMMAR_TOEICMAX_FILE=tên-file-trong-data/
// - GRAMMAR_TOEICMAX_COURSE_IDS=1,2  (lọc course.id; bỏ trống = tất cả)

import fs from "node:fs";
import path from "node:path";
import {
	db,
	grammarCourses,
	grammarExercises,
	grammarSections,
	grammarTopics,
	sql,
} from "@trektoeic/db";
import { GrammarSeedFileSchema } from "@trektoeic/schemas/grammar-course-file-schema";
import { createId } from "@trektoeic/utils/create-id";
import { mapToeicMaxCoursesToGrammarSeed } from "../lib/toeicmax-grammar-mapper";

async function insertGrammarSeed(
	data: ReturnType<typeof GrammarSeedFileSchema.parse>,
) {
	await db.delete(grammarCourses).where(sql`true`);

	for (const [ci, course] of data.courses.entries()) {
		const courseId = createId();
		await db.insert(grammarCourses).values({
			id: courseId,
			slug: course.slug,
			title: course.title,
			description: course.description ?? "",
			sortOrder: ci,
		});

		for (const [ti, topic] of course.topics.entries()) {
			const topicId = createId();
			await db.insert(grammarTopics).values({
				id: topicId,
				courseId,
				slug: topic.slug,
				title: topic.title,
				description: topic.description,
				lessonHtml: topic.lessonHtml ?? null,
				exerciseTypeName: topic.exerciseTypeName ?? "",
				exerciseTypeDes: topic.exerciseTypeDes ?? "",
				relatedParts: topic.relatedParts,
				sortOrder: ti,
			});

			for (const [si, section] of topic.sections.entries()) {
				await db.insert(grammarSections).values({
					id: createId(),
					topicId,
					heading: section.heading,
					body: section.body,
					sortOrder: si,
				});
			}

			for (const [ei, ex] of topic.exercises.entries()) {
				const base = {
					id: createId(),
					topicId,
					exerciseKey: ex.id,
					prompt: ex.prompt,
					explanation: ex.explanation,
					sortOrder: ei,
				};
				if (ex.kind === "fill") {
					await db.insert(grammarExercises).values({
						...base,
						exerciseKind: "fill",
						options: null,
						correctIndex: null,
						fillAnswer: ex.answer,
						hintKeyword: ex.hintKeyword ?? null,
					});
				} else if (ex.kind === "mcq2") {
					await db.insert(grammarExercises).values({
						...base,
						exerciseKind: "mcq2",
						options: [ex.options[0], ex.options[1], "", ""],
						correctIndex: ex.correctIndex,
						fillAnswer: null,
						hintKeyword: null,
					});
				} else {
					await db.insert(grammarExercises).values({
						...base,
						exerciseKind: "mcq4",
						options: ex.options,
						correctIndex: ex.correctIndex,
						fillAnswer: null,
						hintKeyword: null,
					});
				}
			}
		}
	}

	const topicCount = data.courses.reduce((n, c) => n + c.topics.length, 0);
	console.log(
		`Seeded grammar: ${data.courses.length} course(s), ${topicCount} topic(s).`,
	);
}

const main = async () => {
	const useToeicmax = process.argv.includes("--toeicmax");
	const dataDir = path.join(process.cwd(), "data");

	if (useToeicmax) {
		const fileName =
			process.env.GRAMMAR_TOEICMAX_FILE?.trim() || "toiecmax-courses.json";
		const filePath = path.join(dataDir, fileName);
		const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as unknown;
		const idsRaw = process.env.GRAMMAR_TOEICMAX_COURSE_IDS?.trim();
		const courseIds = idsRaw
			? idsRaw
					.split(",")
					.map((s) => Number.parseInt(s.trim(), 10))
					.filter((n) => !Number.isNaN(n))
			: undefined;
		const mapped = mapToeicMaxCoursesToGrammarSeed(raw, { courseIds });
		const data = GrammarSeedFileSchema.parse(mapped);
		await insertGrammarSeed(data);
		return;
	}

	const filePath = path.join(dataDir, "grammar-courses.json");
	const raw = fs.readFileSync(filePath, "utf-8");
	const data = GrammarSeedFileSchema.parse(JSON.parse(raw));
	await insertGrammarSeed(data);
};

main();
