import { drizzleColumnNames } from "../../libs/kysely";
import { kits } from "../../schema";
import { withKysely } from "../../utils";

type ColName = keyof typeof kits.$inferSelect;
const kitColumns = drizzleColumnNames(kits);

export const getKitById = withKysely((db) => {
	return async (
		id: string,
		columns?: {
			[K in ColName]?: boolean;
		},
	) => {
		const selectedColumns = columns
			? kitColumns.filter((col) => columns[col] === true)
			: kitColumns;

		const record = await db
			.selectFrom("kits")
			.select(selectedColumns.length > 0 ? selectedColumns : kitColumns)
			.where("id", "=", id)
			.executeTakeFirst();
		return record || null;
	};
});
