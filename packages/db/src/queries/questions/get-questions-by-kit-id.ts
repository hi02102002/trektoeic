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

export const getQuestionsByKitId = withKysely((db) => async (kitId: string) => {
	const records = await db
		.selectFrom("questions as q")
		.leftJoin("subQuestions as sq", "q.id", "sq.questionId")
		.selectAll("q")
		.select((eb) => [
			kJsonAggBuildObject(jsonColsFromNames(eb, "sq", subQuestionColumns), {
				orderBy: eb.ref("sq.position"),
				filterNotNull: eb.ref("sq.id"),
			}).as("subs"),
		])
		.where("q.kitId", "=", kitId)
		.groupBy("q.id")
		.orderBy("q.part", "asc")
		.orderBy(kSql`split_part(q.position, '-', 1)::int`)
		.execute();

	return z.array(QuestionWithSubsSchema).parse(records);
});
