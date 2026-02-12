import { withKysely } from "../../utils";

export const getPartSectionByPart = withKysely((db) => async (part: number) => {
	const result = await db
		.selectFrom("sections")
		.selectAll()
		.where("part", "=", part)
		.executeTakeFirst();
	return result;
});
