import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export const getRedisClient = (): Redis => {
	try {
		if (client) {
			return client;
		}

		client = new Redis({
			url: "https://settling-molly-14808.upstash.io",
			token: "ATnYAAIncDFkYWNmNTgwZTE4OTg0MzAwOGM2YjU3NmQ3OTRlODc3MXAxMTQ4MDg",
		});

		return client;
	} catch (error) {
		throw new Error(
			"Failed to create Redis client: " + (error as Error).message,
		);
	}
};
