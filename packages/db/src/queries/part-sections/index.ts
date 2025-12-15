import { withDb } from "../../utils";

const getAllPartSections = withDb((db) => async () => {
	const result = await db.query.sections.findMany({
		orderBy(fields, operators) {
			return operators.asc(fields.part);
		},
	});
	return result;
});

const getPartSectionByPart = withDb((db) => async (part: number) => {
	const result = await db.query.sections.findFirst({
		where: (fields, operators) => operators.eq(fields.part, part),
	});
	return result;
});

export const partSectionsQueries = {
	getAllPartSections,
	getPartSectionByPart,
};
