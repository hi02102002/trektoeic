import { withDb } from "../../utils";

export const getToken = withDb((db) => async () => {
	const token = await db.query.toeicMaxTokens.findFirst();
	return token?.token ?? null;
});
