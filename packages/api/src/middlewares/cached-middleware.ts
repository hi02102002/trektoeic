import { os } from "@orpc/server";
import type { getRedisClient } from "../libs/ioredis";

const DEFAULT_EXPIRES_IN_SECONDS = 1 * 60 * 60; // 1 hour

export const cachedMiddleware = (opts?: {
	/**
	 * Custom cache key
	 */
	key?: string;
	/**
	 * Expiration time in seconds
	 */
	expireInSeconds?: number;
}) =>
	os
		.$context<{
			redis?: ReturnType<typeof getRedisClient>;
		}>()
		.middleware(async ({ context, next, path }, input, output) => {
			const key = opts?.key ?? `${path.join(":")}:${JSON.stringify(input)}`;

			const cachedData = await context.redis?.get(key);

			if (cachedData) {
				return output(cachedData);
			}

			const result = await next({
				context,
			});

			await context.redis?.set(key, result.output, {
				ex: opts?.expireInSeconds ?? DEFAULT_EXPIRES_IN_SECONDS,
			});

			return result;
		});
