import { QuestionWithSubsSchema } from "@trektoeic/schemas/question-schema";
import z from "zod";
import {
	drizzleColumnNames,
	jsonColsFromNames,
	kJsonAggBuildObject,
	kSql,
} from "../../libs/kysely";
import { subQuestions } from "../../schema";
import { withKysely } from "../../utils";

const subQuestionColumns = drizzleColumnNames(subQuestions);

export const getRandomQuestionsByPart = withKysely(
	(db) =>
		async ({
			part,
			limit = 10,
			ignores = [],
		}: {
			part: number;
			limit?: number;
			/**
			 * A list of question IDs to ignore when selecting random questions
			 */
			ignores?: string[];
		}) => {
			let query = db
				.selectFrom("questions as q")
				.leftJoin("subQuestions as sq", "q.id", "sq.questionId")
				.selectAll("q")
				.select((eb) => [
					kJsonAggBuildObject(jsonColsFromNames(eb, "sq", subQuestionColumns), {
						orderBy: eb.ref("sq.position"),
						filterNotNull: eb.ref("sq.id"),
					}).as("subs"),
				])
				.where("q.part", "=", part)
				.groupBy("q.id")
				.orderBy(kSql`RANDOM()`)
				.limit(limit);

			if (ignores.length > 0) {
				query = query.where("q.id", "not in", ignores);
			}

			const records = await query.execute();

			return z.array(QuestionWithSubsSchema).parse(records);
		},
);
