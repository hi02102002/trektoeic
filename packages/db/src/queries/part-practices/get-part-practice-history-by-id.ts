import {
	PartPracticeContentSchema,
	PartPracticeHistorySchema,
} from "@trektoeic/schemas/part-practice-schema";
import z from "zod";
import { withUserAndKysely } from "../../utils";
import { questionsQueries } from "../questions";

export const getPartPracticeHistoryById = withUserAndKysely(
	(userId, db) => async (id: string) => {
		const record = await db
			.selectFrom("histories")
			.selectAll()
			.where("id", "=", id)
			.where("userId", "=", userId)
			.where("action", "=", "practice_part")
			.executeTakeFirst();

		if (!record) {
			return null;
		}

		const contents = z.array(PartPracticeContentSchema).parse(record.contents);

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
