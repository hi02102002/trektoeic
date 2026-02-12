import { InsertOrUpdateResult } from "@trektoeic/schemas/db";
import { HistoryActionSchema } from "@trektoeic/schemas/history-schema";
import type { InputPartPracticeHistory } from "@trektoeic/schemas/part-practice-schema";
import z from "zod";
import { withUserAndKysely } from "../../utils";

export const createPartPracticeHistory = withUserAndKysely(
	(userId, db) =>
		async ({ contents, metadata, id }: InputPartPracticeHistory) => {
			const record = await db
				.insertInto("histories")
				.values({
					userId,
					metadata,
					contents,
					action: HistoryActionSchema.enum.practice_part,
					id,
				})
				.returning(["id"])
				.execute();

			return InsertOrUpdateResult(z.object({ id: z.string() })).parse(record);
		},
);
