import type { InferOrderBy } from "@trektoeic/schemas/share-schema";
import { withKysely } from "../../utils";

export const getAllKits = withKysely((db) => {
	return async ({
		year,
		orderBy = {
			direction: "desc",
			field: "year",
		},
	}: {
		year: number | "all";
		orderBy?: InferOrderBy<["year"]>;
	}) => {
		const records = db
			.selectFrom("kits")
			.$if(year !== "all", (qb) => qb.where("year", "=", year as number))
			.orderBy(orderBy.field, orderBy.direction)
			.selectAll()
			.execute();

		return records;
	};
});
