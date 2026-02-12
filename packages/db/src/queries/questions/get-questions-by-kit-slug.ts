import { QuestionWithSubsSchema } from "@trektoeic/schemas/question-schema";
import z from "zod";
import {
	drizzleColumnNames,
	jsonColsFromNames,
	kJsonAggBuildObject,
} from "../../libs/kysely";
import { subQuestions } from "../../schema";
import { withKysely } from "../../utils";
import { kitsQueries } from "../kits";

const subQuestionColumns = drizzleColumnNames(subQuestions);

export const getQuestionsByKitSlug = withKysely(
	(db) => async (kitSlug: string) => {
		const kit = await kitsQueries.getKitBySlug(db)(kitSlug, { id: true });

		if (!kit) {
			return null;
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
			.where("q.kitId", "=", kit.id)
			.orderBy("q.position", "asc")
			.groupBy("q.id")
			.execute();

		return z.array(QuestionWithSubsSchema).parse(records);
	},
);
