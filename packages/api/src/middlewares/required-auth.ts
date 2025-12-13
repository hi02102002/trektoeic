import { ORPCError, os } from "@orpc/server";
import type { auth } from "@trektoeic/auth";

export const requireAuth = os
	.$context<{
		session: Awaited<ReturnType<typeof auth.api.getSession>>;
	}>()
	.middleware(async ({ context, next }) => {
		if (!context.session?.user) {
			throw new ORPCError("UNAUTHORIZED");
		}
		return next({
			context: {
				...context,
				session: context.session,
			},
		});
	});
