import type {
	GrammarExercise,
	GrammarTopic,
} from "@trektoeic/schemas/grammar-course-file-schema";
import { withKysely } from "../../utils";

function mapExerciseRow(e: {
	exerciseKey: string;
	exerciseKind: string;
	prompt: string;
	options: [string, string, string, string] | null;
	correctIndex: number | null;
	fillAnswer: string | null;
	hintKeyword: string | null;
	explanation: string;
}): GrammarExercise {
	const kind = e.exerciseKind || "mcq4";

	if (kind === "fill") {
		return {
			kind: "fill",
			id: e.exerciseKey,
			prompt: e.prompt,
			answer: (e.fillAnswer ?? "").trim(),
			hintKeyword: e.hintKeyword ?? null,
			explanation: e.explanation,
		};
	}

	if (kind === "mcq2") {
		const o = e.options ?? ["", "", "", ""];
		const ci = (n: number): 0 | 1 => (n === 0 || n === 1 ? n : 0);
		return {
			kind: "mcq2",
			id: e.exerciseKey,
			prompt: e.prompt,
			options: [o[0] ?? "", o[1] ?? ""],
			correctIndex: ci(e.correctIndex ?? 0),
			explanation: e.explanation,
		};
	}

	const o = e.options ?? ["", "", "", ""];
	const ci = (n: number): 0 | 1 | 2 | 3 => {
		if (n === 0 || n === 1 || n === 2 || n === 3) return n;
		return 0;
	};
	return {
		kind: "mcq4",
		id: e.exerciseKey,
		prompt: e.prompt,
		options: [o[0], o[1], o[2], o[3]],
		correctIndex: ci(e.correctIndex ?? 0),
		explanation: e.explanation,
	};
}

export const getGrammarTopicBySlug = withKysely(
	(db) =>
		async (slug: string): Promise<GrammarTopic | null> => {
			const topic = await db
				.selectFrom("grammarTopics")
				.selectAll()
				.where("slug", "=", slug)
				.executeTakeFirst();

			if (!topic) return null;

			const sections = await db
				.selectFrom("grammarSections")
				.selectAll()
				.where("topicId", "=", topic.id)
				.orderBy("sortOrder", "asc")
				.execute();

			const exercises = await db
				.selectFrom("grammarExercises")
				.selectAll()
				.where("topicId", "=", topic.id)
				.orderBy("sortOrder", "asc")
				.execute();

			return {
				slug: topic.slug,
				title: topic.title,
				description: topic.description,
				lessonHtml: topic.lessonHtml ?? null,
				exerciseTypeName: topic.exerciseTypeName ?? "",
				exerciseTypeDes: topic.exerciseTypeDes ?? "",
				relatedParts: topic.relatedParts,
				sections: sections.map((s) => ({
					heading: s.heading,
					body: s.body,
				})),
				exercises: exercises.map((row) =>
					mapExerciseRow({
						exerciseKey: row.exerciseKey,
						exerciseKind: row.exerciseKind,
						prompt: row.prompt,
						options: row.options,
						correctIndex: row.correctIndex,
						fillAnswer: row.fillAnswer,
						hintKeyword: row.hintKeyword,
						explanation: row.explanation,
					}),
				),
			};
		},
);
