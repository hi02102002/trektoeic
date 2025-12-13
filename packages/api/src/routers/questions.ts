import { questionsQueries } from "@trektoeic/db/queries";
import { QuestionWithSubsSchema } from "@trektoeic/schemas/question-schema";
import z from "zod";
import { requiredAuthProcedure } from "../procedures";

const tags = ["Questions"] as const;

const getRandomQuestionsByPart = requiredAuthProcedure
	.route({
		method: "GET",
		tags,
	})
	.input(
		z.object({
			part: z.number().min(1).max(7),
			limit: z.number().optional(),
		}),
	)
	.output(z.array(QuestionWithSubsSchema))
	.handler(async ({ input }) => {
		const { part, limit } = input;

		const records = await questionsQueries.getRandomQuestionsByPart()({
			part,
			limit,
		});

		return z.array(QuestionWithSubsSchema).parse(records);
	});

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
	getRandomQuestionsByPart,
};
