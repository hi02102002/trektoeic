import { withKysely } from "../../utils";
import { getToken } from "./get-token";

export const upsertToken = withKysely((db) => async (token: string) => {
	const existing = await getToken(db)();

	if (existing) {
		const updated = await db
			.updateTable("toeicMaxTokens")
			.set({
				token,
			})
			.where("token", "=", existing)
			.returningAll()
			.execute();

		return updated;
	}
	const created = await db
		.insertInto("toeicMaxTokens")
		.values({
			token,
		})
		.returningAll()
		.execute();

	return created;
});
