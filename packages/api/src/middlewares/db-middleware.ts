import { os } from "@orpc/server";
import { type Database, db } from "@trektoeic/db/db";

export const dbProviderMiddleware = os
	.$context<{
		db: Database;
	}>()
	.middleware(async ({ context, next }) => {
		const _db = context.db ?? db;

		return next({
			context: {
				...context,
				db: _db,
			},
		});
	});
