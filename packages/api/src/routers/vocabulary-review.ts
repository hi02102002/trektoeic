import { vocabularyReviewsQueries } from "@trektoeic/db/queries";
import z from "zod";
import { requiredAuthProcedure } from "../procedures";

const TAGS = ["Vocabulary Review"] as const;

export const vocabularyReviewRouter = {
	getDueVocabularies: requiredAuthProcedure
		.route({
			method: "GET",
			tags: TAGS,
			description:
				"Get due vocabularies for review, optionally filtered by category",
		})
		.input(
			z.object({
				limit: z.number().optional().default(20),
				categoryId: z.string().optional(),
			}),
		)
		.output(z.any())
		.handler(async ({ input, context }) => {
			const records = await vocabularyReviewsQueries.getDueVocabularies(
				context.kysely,
			)({
				limit: input.limit,
				categoryId: input.categoryId,
				userId: context.session.user.id,
			});
			return records;
		}),
	getStats: requiredAuthProcedure
		.route({
			method: "GET",
			tags: TAGS,
			description:
				"Get vocabulary review stats, optionally filtered by category",
		})
		.input(
			z.object({
				categoryId: z.string().optional(),
			}),
		)
		.output(
			z.object({
				totalWords: z.number(),
				masteredWords: z.number(),
				newWords: z.number(),
				learningWords: z.number(),
			}),
		)
		.handler(async ({ input, context }) => {
			const stats = await vocabularyReviewsQueries.getStats(
				context.session.user.id,
				context.kysely,
			)({
				categoryId: input.categoryId,
			});
			return stats;
		}),
};
