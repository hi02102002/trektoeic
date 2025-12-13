import { and, count, eq, getTableColumns, sql } from "drizzle-orm";
import { questions, subQuestions } from "../../schema";
import { jsonAggBuildObjectWithOrder, withDb } from "../../utils";

const getTotalQuestionsEachPart = withDb((db) => async () => {
	const result = await db
		.select({
			part: questions.part,
			totalQuestions: count(questions.id),
		})
		.from(questions)
		.groupBy(questions.part);

	return result;
});

const getRandomQuestionsByPart = withDb(
	(db) =>
		async ({ part, limit = 10 }: { part: number; limit?: number }) => {
			const records = await db
				.select({
					...getTableColumns(questions),
					subs: jsonAggBuildObjectWithOrder(
						subQuestions,
						subQuestions.position,
					).as("subs"),
				})
				.from(questions)
				.leftJoin(subQuestions, eq(questions.id, subQuestions.questionId))
				.where(and(eq(questions.part, part)))
				.limit(limit)
				.orderBy(sql`RANDOM()`)
				.groupBy(questions.id);

			return records;
		},
);

export const questionsQueries = {
	getTotalQuestionsEachPart,
	getRandomQuestionsByPart,
};
