import { MockTestHistoryListItemSchema } from "@trektoeic/schemas/mock-test-schema";
import { getPagination } from "@trektoeic/utils/get-pagination";
import z from "zod";
import { withUserAndKysely } from "../../utils";

export const getMockTestHistories = withUserAndKysely(
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
				.where("action", "=", "mock_test");

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

			const histories = z
				.array(MockTestHistoryListItemSchema.shape.history)
				.parse(rows);

			const kitIds = [...new Set(histories.map((item) => item.metadata.kitId))];

			const kits =
				kitIds.length > 0
					? await db
							.selectFrom("kits")
							.select(["id", "slug", "name", "year"])
							.where("id", "in", kitIds)
							.execute()
					: [];

			const kitsMap = new Map(kits.map((kit) => [kit.id, kit]));

			const items = MockTestHistoryListItemSchema.array().parse(
				histories.map((history) => ({
					history,
					kit: kitsMap.get(history.metadata.kitId) ?? null,
				})),
			);

			return getPagination({
				items,
				totalItems,
				page: safePage,
				limit: safeLimit,
			});
		},
);
