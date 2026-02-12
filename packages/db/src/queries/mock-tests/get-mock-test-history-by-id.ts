import { HistoryActionSchema } from "@trektoeic/schemas/history-schema";
import { MockTestHistorySchema } from "@trektoeic/schemas/mock-test-schema";
import { withUserAndKysely } from "../../utils";
import { questionsQueries } from "../questions";

export const getMockTestHistoryById = withUserAndKysely(
	(userId, db) => async (historyId: string) => {
		const _history = await db
			.selectFrom("histories")
			.selectAll()
			.where("id", "=", historyId)
			.where("userId", "=", userId)
			.where("action", "=", HistoryActionSchema.enum.mock_test)
			.executeTakeFirst()
			.then((row) => MockTestHistorySchema.nullable().parse(row));

		if (!_history) {
			return null;
		}

		const questions = await questionsQueries.getQuestionsByKitId(db)(
			_history.metadata.kitId,
		);

		return {
			history: _history,
			questions: questions ?? [],
		};
	},
);
