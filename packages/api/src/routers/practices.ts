import { practicesQueries } from "@trektoeic/db/queries";
import { QuestionWithSubsSchema } from "@trektoeic/schemas/question-schema";
import z from "zod";
import { requiredAuthProcedure } from "../procedures";

const tags = ["Practices"] as const;

const getByPart = requiredAuthProcedure
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

		const records = await practicesQueries.getByPart()({
			part,
			limit,
		});

		return z.array(QuestionWithSubsSchema).parse(records);
	});

export const practices = {
	getByPart,
};
