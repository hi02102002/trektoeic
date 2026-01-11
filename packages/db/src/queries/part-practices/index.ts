import { InsertOrUpdateResult } from "@trektoeic/schemas/db";
import {
	type InputPartPracticeHistory,
	PartPracticeContentSchema,
	PartPracticeHistorySchema,
} from "@trektoeic/schemas/part-practice-schema";
import { and, eq, sql } from "drizzle-orm";
import { sql as kSql } from "kysely";
import z from "zod";
import { history } from "../../schema";
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

// const getCurrentProgressOfPartPractice = withDbAndUser(
// 	({ db, userId }) =>
// 		async (part: number | string) => {
// 			const [records, totalQuestions] = await Promise.all([
// 				db
// 					.select()
// 					.from(history)
// 					.where(
// 						and(
// 							eq(history.userId, userId),
// 							eq(history.action, "practice_part"),
// 							eq(sql`${history.metadata}->>'part'`, part.toString()),
// 						),
// 					),
// 				db
// 					.select({
// 						count: count(questions.id),
// 					})
// 					.from(questions)
// 					.where(eq(questions.part, Number(part)))
// 					.then((r) => r[0]?.count || 0),
// 			]);

// 			const attempt = records.length || 0;
// 			const correctQuestionIds = new Set<string>();

// 			for (const record of records) {
// 				const contents = z
// 					.array(PartPracticeContentSchema)
// 					.parse(record.contents);

// 				for (const content of contents) {
// 					if (content.isCorrect) {
// 						correctQuestionIds.add(content.questionId);
// 					}
// 				}
// 			}

// 			return {
// 				attempt,
// 				correct: correctQuestionIds.size,
// 				completed:
// 					correctQuestionIds.size > 0
// 						? Math.max(
// 								1,
// 								Math.round(
// 									(correctQuestionIds.size / (totalQuestions || 1)) * 100,
// 								),
// 							)
// 						: 0,
// 			};
// 		},
// );

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

export const partPracticesQueries = {
	getPartPractices,
	createPartPracticeHistory,
	getPartPracticeHistoryById,
	getCurrentProgressOfPartPractice,
};
