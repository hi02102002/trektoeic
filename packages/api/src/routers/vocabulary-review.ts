import { vocabularyReviewsQueries } from "@trektoeic/db/queries";
import { VocabularyReviewGradeSchema } from "@trektoeic/schemas/vocabularies-shared-schema";
import {
	GetDueVocabulariesResultSchema,
	VocabularyReviewCardPreviewSchema,
	VocabularyReviewCardSchema,
} from "@trektoeic/schemas/vocabulary-review-schema";
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
		.output(GetDueVocabulariesResultSchema)
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
	submitReviewGrade: requiredAuthProcedure
		.route({
			method: "POST",
			tags: TAGS,
			description: "Submit a review grade for a vocabulary card",
		})
		.input(
			z.object({
				vocabularyId: z.string(),
				grade: VocabularyReviewGradeSchema,
			}),
		)
		.output(
			z.object({
				review: VocabularyReviewCardSchema,
				preview: VocabularyReviewCardPreviewSchema,
			}),
		)
		.handler(async ({ input, context }) => {
			const result = await vocabularyReviewsQueries.submitReviewGrade(
				context.session.user.id,
				context.kysely,
			)({
				vocabularyId: input.vocabularyId,
				grade: input.grade,
			});

			return result;
		}),
};
