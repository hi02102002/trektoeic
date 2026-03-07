import { PartPracticeHistorySchema } from "@trektoeic/schemas/part-practice-schema";
import { getPagination } from "@trektoeic/utils/get-pagination";
import z from "zod";
import { withUserAndKysely } from "../../utils";

export const getPartPracticeHistories = withUserAndKysely(
	(userId, db) =>
		async ({ limit = 20, page = 1 }: { limit?: number; page?: number }) => {
			const safeLimit =
				typeof limit === "number" && Number.isFinite(limit) ? limit : 20;
			const safePage =
				typeof page === "number" && Number.isFinite(page) && page > 0
					? page
					: 1;

			const baseQuery = db
				.selectFrom("histories")
				.where("userId", "=", userId)
				.where("action", "=", "practice_part");

			const [rows, { total: totalItems }] = await Promise.all([
				baseQuery
					.selectAll()
					.orderBy("createdAt", "desc")
					.limit(safeLimit)
					.offset((safePage - 1) * safeLimit)
					.execute(),
				baseQuery
					.select((eb) => eb.fn.count<number>("id").as("total"))
					.executeTakeFirstOrThrow(),
			]);

			const items = z.array(PartPracticeHistorySchema).parse(rows);

			return getPagination({
				items,
				totalItems,
				page: safePage,
				limit: safeLimit,
			});
		},
);
