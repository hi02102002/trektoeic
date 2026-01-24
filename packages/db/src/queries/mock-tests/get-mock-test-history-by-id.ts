import { HistoryActionSchema } from "@trektoeic/schemas/history-schema";
import { MockTestHistorySchema } from "@trektoeic/schemas/mock-test-schema";
import { and, eq } from "drizzle-orm";
import { history } from "../../schema";
import { withDbAndUser } from "../../utils";
import { questionsQueries } from "../questions";

export const getMockTestHistoryById = withDbAndUser(
	({ db, userId }) =>
		async (historyId: string) => {
			const _history = await db
				.select()
				.from(history)
				.where(
					and(
						eq(history.id, historyId),
						eq(history.userId, userId),
						eq(history.action, HistoryActionSchema.enum.mock_test),
					),
				)
				.limit(1)
				.then((rows) => MockTestHistorySchema.nullable().parse(rows[0]));

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
