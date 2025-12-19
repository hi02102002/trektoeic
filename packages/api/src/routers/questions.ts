import { questionsQueries } from "@trektoeic/db/queries";

import z from "zod";
import { requiredAuthProcedure } from "../procedures";

const tags = ["Questions"] as const;

const getTotalQuestionsEachPart = requiredAuthProcedure
	.route({
		method: "GET",
		tags,
	})
	.output(z.array(z.object({ part: z.number(), totalQuestions: z.number() })))
	.handler(async () => {
		const result = await questionsQueries.getTotalQuestionsEachPart()();

		return result;
	});

export const questions = {
	getTotalQuestionsEachPart,
};
