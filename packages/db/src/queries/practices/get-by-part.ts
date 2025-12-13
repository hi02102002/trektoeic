import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { questions, subQuestions } from "../../schema";
import { jsonAggBuildObjectWithOrder, withDb } from "../../utils";

//TODO: Need to integrate with histories table to get only un completed questions
export const getByPart = withDb(
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
