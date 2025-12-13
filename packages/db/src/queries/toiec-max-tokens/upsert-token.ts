import { eq } from "drizzle-orm";
import { toeicMaxTokens } from "../../schema";
import { withDb } from "../../utils";
import { getToken } from "./get-token";

export const upsertToken = withDb((db) => async (token: string) => {
	const existing = await getToken()();

	if (existing) {
		const updated = await db
			.update(toeicMaxTokens)
			.set({
				token,
			})
			.where(eq(toeicMaxTokens.token, existing))
			.returning();

		return updated;
	}
	const created = await db
		.insert(toeicMaxTokens)
		.values({
			token,
		})
		.returning();

	return created;
});
