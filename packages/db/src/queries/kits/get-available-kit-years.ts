import { withKysely } from "../../utils";

export const getAvailableKitYears = withKysely((db) => {
	return async () => {
		const records = await db
			.selectFrom("kits")
			.select("year")
			.distinct()
			.orderBy("year", "desc")
			.execute();

		return records.map((r) => r.year);
	};
});
