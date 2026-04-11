import { grammarQueries } from "@trektoeic/db/queries";
import {
	GrammarTopicDetailSchema,
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
			return grammarQueries.listGrammarTopicSummaries(context.kysely)({
				userId: context.session.user.id,
			});
		}),

	getTopicBySlug: requiredAuthProcedure
		.route({
			method: "GET",
			tags: TAGS,
		})
		.input(z.object({ slug: z.string() }))
		.output(GrammarTopicDetailSchema.nullable())
		.handler(async ({ input, context }) => {
			return grammarQueries.getGrammarTopicBySlug(context.kysely)(
				input.slug,
				context.session.user.id,
			);
		}),

	setTopicStudied: requiredAuthProcedure
		.route({
			method: "POST",
			tags: TAGS,
			description: "Đánh dấu chủ đề ngữ pháp đã học hoặc bỏ đánh dấu",
		})
		.input(
			z.object({
				slug: z.string(),
				studied: z.boolean(),
			}),
		)
		.output(
			z.discriminatedUnion("ok", [
				z.object({ ok: z.literal(true) }),
				z.object({
					ok: z.literal(false),
					error: z.literal("not_found"),
				}),
			]),
		)
		.handler(async ({ input, context }) => {
			return grammarQueries.setGrammarTopicStudied(
				context.session.user.id,
				context.kysely,
			)(input);
		}),
};
