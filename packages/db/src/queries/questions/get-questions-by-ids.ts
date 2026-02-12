import { QuestionWithSubsSchema } from "@trektoeic/schemas/question-schema";
import z from "zod";
import {
	drizzleColumnNames,
	jsonColsFromNames,
	kJsonAggBuildObject,
} from "../../libs/kysely";
import { subQuestions } from "../../schema";
import { withKysely } from "../../utils";

const subQuestionColumns = drizzleColumnNames(subQuestions);

export const getQuestionsByIds = withKysely((db) => async (ids: string[]) => {
	if (ids.length === 0) {
		return [];
	}

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
		.where("q.id", "in", ids)
		.groupBy("q.id")
		.execute();

	const indexMap = new Map(ids.map((id, index) => [id, index]));
	records.sort(
		(a, b) =>
			(indexMap.get(String(a.id)) ?? Number.MAX_SAFE_INTEGER) -
			(indexMap.get(String(b.id)) ?? Number.MAX_SAFE_INTEGER),
	);

	return z.array(QuestionWithSubsSchema).parse(records);
});
