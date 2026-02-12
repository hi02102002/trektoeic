import { withKysely } from "../../utils";

export const getAllPartSections = withKysely((db) => async () => {
	const result = await db
		.selectFrom("sections")
		.selectAll()
		.orderBy("part", "asc")
		.execute();
	return result;
});
