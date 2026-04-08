import {
	createMockTestHistory,
	getMockTestHistories,
	getMockTestHistoryById,
} from "@trektoeic/db/queries";

import {
	InputMockTestHistorySchema,
	MockTestHistoryListItemSchema,
	MockTestHistorySchema,
} from "@trektoeic/schemas/mock-test-schema";
import { QuestionWithSubsSchema } from "@trektoeic/schemas/question-schema";
import {
	PaginatedResultSchema,
	PaginationInputSchema,
} from "@trektoeic/schemas/share-schema";
import z from "zod";
import { cachedMiddleware } from "../middlewares";
import { requiredAuthProcedure } from "../procedures";

const TAGS = ["MockTest"] as const;

export const mockTestRouter = {
	createMockTestHistory: requiredAuthProcedure
		.route({
			method: "POST",
			tags: TAGS,
		})
		.input(InputMockTestHistorySchema)
		.handler(async ({ input, context }) => {
			const inserted = await createMockTestHistory(
				context.session.user.id,
				context.kysely,
			)(input);

			return inserted;
		}),
	getMockTestHistories: requiredAuthProcedure
		.route({
			method: "GET",
			tags: TAGS,
		})
		.input(PaginationInputSchema)
		.output(PaginatedResultSchema(MockTestHistoryListItemSchema))
		.handler(async ({ input, context }) => {
			const histories = await getMockTestHistories(
				context.session.user.id,
				context.kysely,
			)({
				limit: input.limit,
				page: input.page,
			});

			return histories;
		}),
	getMockTestByHistoryId: requiredAuthProcedure
		.use(
			cachedMiddleware({
				expireInSeconds: 60 * 60,
			}),
		)
		.route({
			method: "GET",
			tags: TAGS,
		})
		.input(
			z.object({
				historyId: z.string(),
			}),
		)
		.output(
			z
				.object({
					history: MockTestHistorySchema,
					questions: z.array(QuestionWithSubsSchema),
				})
				.nullable(),
		)
		.handler(async ({ input, context }) => {
			const { historyId } = input;

			const result = await getMockTestHistoryById(
				context.session.user.id,
				context.kysely,
			)(historyId);

			return result;
		}),
};
