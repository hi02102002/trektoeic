import { withKysely } from "../../utils";

export const getToken = withKysely((db) => async () => {
	const token = await db
		.selectFrom("toeicMaxTokens")
		.select("token")
		.executeTakeFirst();

	return token?.token ?? null;
});
