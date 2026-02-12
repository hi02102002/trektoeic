import { os } from "@orpc/server";
import { env } from "@trektoeic/env";
import type { storage } from "../libs/storage";

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
			kv?: typeof storage;
		}>()
		.middleware(async ({ context, next, path }, input, output) => {
			if (env.NODE_ENV === "development") {
				return next();
			}

			const key = opts?.key ?? `${path.join(":")}:${JSON.stringify(input)}`;

			const cachedData = await context.kv?.getItem(key);

			if (cachedData) {
				return output(cachedData);
			}

			const result = await next({
				context,
			});

			await context.kv?.setItem(key, result.output, {
				ttl: opts?.expireInSeconds ?? DEFAULT_EXPIRES_IN_SECONDS,
			});

			return result;
		});
