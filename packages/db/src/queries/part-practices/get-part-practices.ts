import { PartPracticeContentSchema } from "@trektoeic/schemas/part-practice-schema";
import { kSql } from "../../libs/kysely";
import { withKysely } from "../../utils";
import { questionsQueries } from "../questions";

export const getPartPractices = withKysely(
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
				.selectFrom("histories")
				.select("contents")
				.where("userId", "=", userId)
				.where("action", "=", "practice_part")
				.where(kSql`metadata->>'part'`, "=", part.toString())
				.execute()
				.then((records) => {
					const flattened = records.flatMap(
						(record) => (record.contents as unknown[]) ?? [],
					);

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
