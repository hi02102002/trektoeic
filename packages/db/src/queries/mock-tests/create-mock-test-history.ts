import { InsertOrUpdateResult } from "@trektoeic/schemas/db";
import { HistoryActionSchema } from "@trektoeic/schemas/history-schema";
import type { InputMockTestHistory } from "@trektoeic/schemas/mock-test-schema";
import { createId } from "@trektoeic/utils/create-id";
import z from "zod";
import { json } from "../../libs/kysely/json";
import { withUserAndKysely } from "../../utils";

export const createMockTestHistory = withUserAndKysely(
	(userId, db) =>
		async ({ contents, metadata }: InputMockTestHistory) => {
			const record = await db
				.insertInto("histories")
				.values({
					userId,
					metadata: json(metadata),
					contents: json(contents),
					action: HistoryActionSchema.enum.mock_test,
					id: createId(),
				})
				.returning(["id"])
				.execute();

			return InsertOrUpdateResult(z.object({ id: z.string() })).parse(record);
		},
);
