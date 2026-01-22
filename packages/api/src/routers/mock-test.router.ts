import { createMockTestHistory } from "@trektoeic/db/queries/mock-tests/create-mock-test-history";
import { InputMockTestHistorySchema } from "@trektoeic/schemas/mock-test-schema";
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
				context.db,
			)(input);

			return inserted;
		}),
};
