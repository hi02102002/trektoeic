import { createMockTestHistory } from "@trektoeic/db/queries/mock-tests/create-mock-test-history";
import { getMockTestHistoryById } from "@trektoeic/db/queries/mock-tests/get-mock-test-history-by-id";
import {
	InputMockTestHistorySchema,
	MockTestHistorySchema,
} from "@trektoeic/schemas/mock-test-schema";
import { QuestionWithSubsSchema } from "@trektoeic/schemas/question-schema";
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
