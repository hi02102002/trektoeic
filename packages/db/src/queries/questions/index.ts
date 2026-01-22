import { QuestionWithSubsSchema } from "@trektoeic/schemas/question-schema";
import {
	and,
	count,
	eq,
	getTableColumns,
	inArray,
	notInArray,
	sql,
} from "drizzle-orm";
import z from "zod";
import { questions, subQuestions } from "../../schema";
import { jsonAggBuildObjectWithOrder, withDb } from "../../utils";
import { arrayPosition } from "../../utils/array-position";
import { sqlTrue } from "../../utils/sql-true";
import { kitsQueries } from "../kits";

const getTotalQuestionsEachPart = withDb((db) => async () => {
	const result = await db
		.select({
			part: questions.part,
			totalQuestions: count(questions.id),
		})
		.from(questions)
		.groupBy(questions.part)
		.$withCache({
			tag: "questions_total_each_part",
			config: {
				ex: 60 * 60, // 1 hour
			},
		});

	return result;
});

const getRandomQuestionsByPart = withDb(
	(db) =>
		async ({
			part,
			limit = 10,
			ignores = [],
		}: {
			part: number;
			limit?: number;
			/**
			 * A list of question IDs to ignore when selecting random questions
			 */
			ignores?: string[];
		}) => {
			const records = await db
				.select({
					...getTableColumns(questions),
					subs: jsonAggBuildObjectWithOrder(
						subQuestions,
						subQuestions.position,
						subQuestions.id,
					).as("subs"),
				})
				.from(questions)
				.leftJoin(subQuestions, eq(questions.id, subQuestions.questionId))
				.where(
					and(
						eq(questions.part, part),
						ignores.length > 0 ? notInArray(questions.id, ignores) : sqlTrue,
					),
				)
				.limit(limit)
				.orderBy(sql`RANDOM()`)
				.groupBy(questions.id);

			return z.array(QuestionWithSubsSchema).parse(records);
		},
);

const getQuestionsByIds = withDb((db) => async (ids: string[]) => {
	const records = await db
		.select({
			...getTableColumns(questions),
			subs: jsonAggBuildObjectWithOrder(
				subQuestions,
				subQuestions.position,
				subQuestions.id,
			).as("subs"),
		})
		.from(questions)
		.leftJoin(subQuestions, eq(questions.id, subQuestions.questionId))
		.where(and(inArray(questions.id, ids)))
		.orderBy(ids.length > 0 ? arrayPosition(ids, questions.id) : sql`NULL`)
		.groupBy(questions.id)
		.$withCache();

	return z.array(QuestionWithSubsSchema).parse(records);
});

const getQuestionsByKitId = withDb((db) => async (kitId: string) => {
	const records = await db
		.select({
			...getTableColumns(questions),
			subs: jsonAggBuildObjectWithOrder(
				subQuestions,
				subQuestions.position,
				subQuestions.id,
			).as("subs"),
		})
		.from(questions)
		.leftJoin(subQuestions, eq(questions.id, subQuestions.questionId))
		.where(and(eq(questions.kitId, kitId)))
		.orderBy(
			questions.part,
			sql`split_part(${questions.position}, '-', 1)::int`,
		)
		.groupBy(questions.id);

	return z.array(QuestionWithSubsSchema).parse(records);
});

const getQuestionsByKitSlug = withDb((db) => async (kitSlug: string) => {
	const kit = await kitsQueries.getKitById(db)(kitSlug, { id: true });

	if (!kit) {
		return null;
	}

	const records = await db
		.select({
			...getTableColumns(questions),
			subs: jsonAggBuildObjectWithOrder(
				subQuestions,
				subQuestions.position,
				subQuestions.id,
			).as("subs"),
		})
		.from(questions)
		.leftJoin(subQuestions, eq(questions.id, subQuestions.questionId))
		.where(and(eq(questions.kitId, kit.id)))
		.orderBy(questions.position)
		.groupBy(questions.id);

	return z.array(QuestionWithSubsSchema).parse(records);
});

export const questionsQueries = {
	getTotalQuestionsEachPart,
	getRandomQuestionsByPart,
	getQuestionsByIds,
	getQuestionsByKitId,
	getQuestionsByKitSlug,
};
