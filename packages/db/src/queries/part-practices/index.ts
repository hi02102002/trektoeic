import { InsertOrUpdateResult } from "@trektoeic/schemas/db";
import {
	type InputPartPracticeHistory,
	PartPracticeContentSchema,
	PartPracticeHistorySchema,
} from "@trektoeic/schemas/part-practice-schema";
import { QuestionWithSubsSchema } from "@trektoeic/schemas/question-schema";
import { and, eq, sql } from "drizzle-orm";
import z from "zod";
import {
	drizzleColumnNames,
	jsonColsFromNames,
	kJsonAggBuildObject,
	kSql,
	selectColsFromNames,
} from "../../libs/kysely";
import { history, questions, subQuestions } from "../../schema";
import { withDb, withDbAndUser, withUserAndKysely } from "../../utils";
import { questionsQueries } from "../questions";

const getPartPractices = withDb(
	(db) =>
		async ({
			part,
			limit,
			userId,
		}: {
			part: number;
			limit: number;
			userId: string;
		}) => {
			const ignores = await db
				.select({
					contents: history.contents,
				})
				.from(history)
				.where(
					and(
						eq(history.userId, userId),
						eq(history.action, "practice_part"),
						eq(sql`${history.metadata}->>'part'`, part.toString()),
					),
				)
				.then((records) => {
					const flattened = records.flatMap((record) => record.contents);

					// only get questionIds which have been answered incorrectly or not answered
					return flattened
						.map((content) => PartPracticeContentSchema.parse(content))
						.filter((c) => !c.userAnswer || c.isCorrect === false)
						.map((content) => content.questionId);
				});

			const questions = await questionsQueries.getRandomQuestionsByPart(db)({
				part,
				limit,
				ignores,
			});

			return questions;
		},
);

const createPartPracticeHistory = withDbAndUser(
	({ db, userId }) =>
		async ({ contents, metadata, id }: InputPartPracticeHistory) => {
			const record = await db
				?.insert(history)
				.values({
					userId,
					metadata,
					contents,
					action: "practice_part",
					id,
				})
				.returning({
					id: history.id,
				});

			return InsertOrUpdateResult(z.object({ id: z.string() })).parse(record);
		},
);

const getPartPracticeHistoryById = withDbAndUser(
	({ db, userId }) =>
		async (id: string) => {
			const record = await db
				?.select()
				.from(history)
				.where(
					and(
						eq(history.id, id),
						eq(history.userId, userId),
						eq(history.action, "practice_part"),
					),
				)
				.limit(1)
				.then((r) => r?.[0]);

			if (!record) {
				return null;
			}

			const contents = z
				.array(PartPracticeContentSchema)
				.parse(record.contents);

			if (contents.length === 0) {
				return null;
			}

			const questions = await questionsQueries.getQuestionsByIds(db)(
				contents.map((c) => c.questionId),
			);

			return {
				history: PartPracticeHistorySchema.parse(record),
				questions,
			};
		},
);

const getCurrentProgressOfPartPractice = withUserAndKysely(
	(userId, db) => async (part: number | string) => {
		const result = await db
			.with("practice_records", (qb) =>
				qb
					.selectFrom("histories")
					.select(["id", "contents"])
					.where("userId", "=", userId)
					.where("action", "=", "practice_part")
					.where(kSql`metadata->>'part'`, "=", part.toString()),
			)
			.with("total_questions", (qb) =>
				qb
					.selectFrom("questions")
					.select(({ fn }) => [fn.count<number>("id").as("count")])
					.where("part", "=", Number(part)),
			)
			.with("correct_answers", (qb) =>
				qb
					.selectFrom(
						kSql`practice_records, jsonb_array_elements(practice_records.contents)`.as(
							"elem",
						),
					)
					.select(kSql<string>`DISTINCT elem->>'questionId'`.as("questionId"))
					.where(kSql`(elem->>'isCorrect')::boolean`, "=", true),
			)
			.selectFrom("practice_records")
			.select(({ fn, selectFrom }) => [
				fn.count<number>("practice_records.id").as("attempt"),
				selectFrom("correct_answers")
					.select(({ fn }) => fn.count<number>("questionId").as("count"))
					.as("correct"),
				selectFrom("total_questions").select("count").as("totalQuestions"),
			])
			.executeTakeFirst();

		const attempt = Number(result?.attempt || 0);
		const correct = Number(result?.correct || 0);
		const totalQuestions = Number(result?.totalQuestions || 0);

		return {
			attempt,
			correct,
			completed:
				correct > 0
					? Math.max(1, Math.round((correct / (totalQuestions || 1)) * 100))
					: 0,
		};
	},
);

const getRedoPartPractices = withUserAndKysely(
	(userId, db) => async (historyId: string) => {
		const records = await db
			.with("ids_to_redo", (qb) =>
				qb
					.selectFrom("histories")
					.innerJoin(
						kSql`jsonb_array_elements(histories.contents) WITH ORDINALITY`.as(
							"elem",
						),
						(join) => join.onTrue(),
					)
					.where("histories.id", "=", historyId)
					.where("histories.userId", "=", userId)
					.select([
						kSql<string>`elem.value->>'questionId'`.as("questionId"),
						kSql<number>`elem.ordinality`.as("order_index"),
					]),
			)
			.with("questions", (qb) => {
				return qb
					.selectFrom("questions")
					.where("questions.id", "in", (qb) => {
						return qb.selectFrom("ids_to_redo").select("questionId");
					})
					.innerJoin("ids_to_redo", "ids_to_redo.questionId", "questions.id")
					.leftJoin("subQuestions", "subQuestions.questionId", "questions.id")
					.select((eb) => {
						const questionCols = drizzleColumnNames(questions);
						const subQuestionCols = drizzleColumnNames(subQuestions);

						return [
							...selectColsFromNames(eb, "questions", questionCols),
							kJsonAggBuildObject(
								jsonColsFromNames(eb, "subQuestions", subQuestionCols),
							).as("subs"),
						];
					})
					.groupBy(["questions.id", "ids_to_redo.order_index"])
					.orderBy("ids_to_redo.order_index");
			})
			.selectFrom("questions")
			.selectAll()
			.execute();

		console.log(records);

		return z.array(QuestionWithSubsSchema).parse(records);
	},
);

export const partPracticesQueries = {
	getPartPractices,
	createPartPracticeHistory,
	getPartPracticeHistoryById,
	getCurrentProgressOfPartPractice,
	getRedoPartPractices,
};
