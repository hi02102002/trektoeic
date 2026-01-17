import type { InferOrderBy } from "@trektoeic/schemas/share-schema";
import { desc, eq } from "drizzle-orm";
import { kits } from "../../schema";
import { withDb, withKysely } from "../../utils";

type ColName = keyof typeof kits.$inferSelect;

const getKitById = withDb((db) => {
	return async (
		id: string,
		columns?: {
			[K in ColName]?: boolean;
		},
	) => {
		const record = await db.query.kits.findFirst({
			where: eq(kits.id, id),
			columns,
		});
		return record || null;
	};
});

const getKitBySlug = withDb((db) => {
	return async (
		slug: string,
		columns?: {
			[K in ColName]?: boolean;
		},
	) => {
		const record = await db.query.kits.findFirst({
			where: eq(kits.slug, slug),
			columns,
		});
		return record || null;
	};
});

const getAllKits = withKysely((db) => {
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

const getAvailableKitYears = withDb((db) => {
	return async () => {
		const records = await db
			.selectDistinctOn([kits.year])
			.from(kits)
			.orderBy(desc(kits.year));

		return records.map((r) => r.year);
	};
});

export const kitsQueries = {
	getAllKits,
	getAvailableKitYears,
	getKitById,
	getKitBySlug,
};
