import { kSql } from "../../libs/kysely";
import { withUserAndKysely } from "../../utils";

export const getCurrentProgressOfPartPractice = withUserAndKysely(
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
