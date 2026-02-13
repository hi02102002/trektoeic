import { vocabulariesQueries } from "@trektoeic/db/queries";
import { PaginatedResultSchema } from "@trektoeic/schemas/share-schema";
import {
	VocabularyCategorySchema,
	VocabularySchema,
} from "@trektoeic/schemas/vocabularies-schema";
import z from "zod";
import { requiredAuthProcedure } from "../procedures";

export const vocabulariesRouter = {
	getAllCategories: requiredAuthProcedure
		.input(
			z.object({
				parentId: z.string().optional(),
				level: z.number().optional().default(1),
			}),
		)
		.output(z.array(VocabularyCategorySchema))
		.handler(async ({ input, context }) => {
			return vocabulariesQueries.getAllCategories(
				context.session.user.id,
				context.kysely,
			)({
				parentId: input.parentId,
				level: input.level,
			});
		}),
	getCategoryById: requiredAuthProcedure
		.input(z.object({ id: z.string() }))
		.output(VocabularyCategorySchema.nullable())
		.handler(async ({ input, context }) => {
			return vocabulariesQueries.getCategoryById(
				context.session.user.id,
				context.kysely,
			)({ id: input.id });
		}),
	getCategoryBySlug: requiredAuthProcedure
		.input(z.object({ slug: z.string() }))
		.output(VocabularyCategorySchema.nullable())
		.handler(async ({ input, context }) => {
			return vocabulariesQueries.getCategoryBySlug(
				context.session.user.id,
				context.kysely,
			)({ slug: input.slug });
		}),
	getVocabulariesByCategoryId: requiredAuthProcedure
		.input(
			z.object({
				categoryId: z.string(),
				page: z.number().optional().default(1),
				limit: z.number().optional().default(12),
			}),
		)
		.output(PaginatedResultSchema(VocabularySchema))
		.handler(async ({ input, context }) => {
			return vocabulariesQueries.getVocabulariesByCategoryId(
				context.session.user.id,
				context.kysely,
			)({
				categoryId: input.categoryId,
				page: input.page,
				limit: input.limit,
			});
		}),
};
