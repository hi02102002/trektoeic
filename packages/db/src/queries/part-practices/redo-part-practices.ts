import {
	PartPracticeContentSchema,
	PartPracticeMetadataSchema,
} from "@trektoeic/schemas/part-practice-schema";
import z from "zod";
import { withUserAndKysely } from "../../utils";
import { questionsQueries } from "../questions";

/**
 * Redo a part practice session by getting all questions from a previous practice history
 */
export const redoPartPractices = withUserAndKysely(
	(userId, db) => async (historyId: string) => {
		const record = await db
			.selectFrom("histories")
			.selectAll()
			.where("id", "=", historyId)
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

		const allQuestionIds = contents.map((c) => c.questionId);
		const uniqueQuestionIds = [...new Set(allQuestionIds)];
		const metadata = PartPracticeMetadataSchema.parse(record.metadata);
		const questions =
			await questionsQueries.getQuestionsByIds(db)(uniqueQuestionIds);

		return {
			questions,
			metadata,
			originalHistoryId: historyId,
		};
	},
);
