import { env } from "@trektoeic/env";
import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export const getRedisClient = (): Redis => {
	try {
		if (client) {
			return client;
		}

		client = new Redis({
			url: env.UPSTASH_REDIS_REST_URL,
			token: env.UPSTASH_REDIS_REST_TOKEN,
		});

		return client;
	} catch (error) {
		throw new Error(
			`Failed to create Redis client: ${(error as Error).message}`,
		);
	}
};
