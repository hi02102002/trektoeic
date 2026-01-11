import { os } from "@orpc/server";
import { kysely } from "@trektoeic/db";
import type { KyselyDb } from "@trektoeic/db/types/index";

export const kyselyProviderMiddleware = os
	.$context<{
		kysely: KyselyDb;
	}>()
	.middleware(async ({ context, next }) => {
		const _kysely = context.kysely ?? kysely;

		return next({
			context: {
				...context,
				kysely: _kysely,
			},
		});
	});
