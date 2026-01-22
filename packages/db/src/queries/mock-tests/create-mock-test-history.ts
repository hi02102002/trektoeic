import { InsertOrUpdateResult } from "@trektoeic/schemas/db";
import { HistoryActionSchema } from "@trektoeic/schemas/history-schema";
import type { InputMockTestHistory } from "@trektoeic/schemas/mock-test-schema";
import z from "zod";
import { history } from "../../schema";
import { withDbAndUser } from "../../utils";

export const createMockTestHistory = withDbAndUser(
	({ db, userId }) =>
		async ({ contents, metadata }: InputMockTestHistory) => {
			const record = await db
				.insert(history)
				.values({
					userId,
					metadata,
					contents,
					action: HistoryActionSchema.enum.mock_test,
				})
				.returning({
					id: history.id,
				});

			return InsertOrUpdateResult(z.object({ id: z.string() })).parse(record);
		},
);
