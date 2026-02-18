import { deckOfUsersQueries } from "@trektoeic/db/queries/index";
import {
	createSortInputSchema,
	PaginatedResultSchema,
	PaginationInputSchema,
	QueryInputSchema,
} from "@trektoeic/schemas/share-schema";
import { VocabularyCategorySchema } from "@trektoeic/schemas/vocabularies-schema";
import z from "zod";
import { requiredAuthProcedure } from "../procedures";

const TAGS = ["Deck of User"] as const;

export const deckOfUserRouter = {
	getDeckOfUser: requiredAuthProcedure
		.route({
			method: "GET",
			tags: TAGS,
			description: "Get the user's deck of categories",
		})
		.input(
			z.object(PaginationInputSchema.shape).extend({
				query: QueryInputSchema.optional(),
				sort: createSortInputSchema([
					"du.updatedAt",
					"du.createdAt",
					"vc.name",
				] as const),
			}),
		)
		.output(PaginatedResultSchema(VocabularyCategorySchema))
		.handler(async ({ input, context }) => {
			const res = await deckOfUsersQueries.getDeckOfUser(context.kysely)({
				userId: context.session.user.id,
				limit: input.limit,
				page: input.page,
				query: input.query,
				sort: input.sort,
			});

			return res;
		}),
};
