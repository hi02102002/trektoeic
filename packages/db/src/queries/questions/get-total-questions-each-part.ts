import { kSql } from "../../libs/kysely";
import { withKysely } from "../../utils";

export const getTotalQuestionsEachPart = withKysely((db) => async () => {
	const result = await db
		.selectFrom("questions")
		.select([
			"part",
			kSql<number>`CAST(COUNT(id) AS INTEGER)`.as("totalQuestions"),
		])
		.groupBy("part")
		.execute();

	return result;
});
