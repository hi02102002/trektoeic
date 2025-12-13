import { os } from "@orpc/server";
import { getRedisClient } from "../libs/ioredis";

export const redisProviderMiddleware = os
	.$context<{
		redis?: ReturnType<typeof getRedisClient>;
	}>()
	.middleware(async ({ context, next }) => {
		const redis = context?.redis ?? getRedisClient();

		return next({
			context: {
				...context,
				redis,
			},
		});
	});
