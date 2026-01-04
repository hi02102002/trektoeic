import { InsertOrUpdateResult } from "@trektoeic/schemas/db";
import {
	type InputPartPracticeHistory,
	PartPracticeContentSchema,
	PartPracticeHistorySchema,
} from "@trektoeic/schemas/part-practice-schema";
import { and, eq, sql } from "drizzle-orm";
import z from "zod";
import { history } from "../../schema";
import { withDb, withDbAndUser } from "../../utils";
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

					return flattened
						.map((content) => PartPracticeContentSchema.parse(content))
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

export const partPracticesQueries = {
	getPartPractices,
	createPartPracticeHistory,
	getPartPracticeHistoryById,
};
