import { grammarQueries } from "@trektoeic/db/queries";
import {
	GrammarTopicSchema,
	GrammarTopicSummarySchema,
} from "@trektoeic/schemas/grammar-course-file-schema";
import z from "zod";
import { requiredAuthProcedure } from "../procedures";

const TAGS = ["Grammar"];

export const grammarRouter = {
	listTopics: requiredAuthProcedure
		.route({
			method: "GET",
			tags: TAGS,
		})
		.output(z.array(GrammarTopicSummarySchema))
		.handler(async ({ context }) => {
			return grammarQueries.listGrammarTopicSummaries(context.kysely)();
		}),

	getTopicBySlug: requiredAuthProcedure
		.route({
			method: "GET",
			tags: TAGS,
		})
		.input(z.object({ slug: z.string() }))
		.output(GrammarTopicSchema.nullable())
		.handler(async ({ input, context }) => {
			return grammarQueries.getGrammarTopicBySlug(context.kysely)(input.slug);
		}),
};
