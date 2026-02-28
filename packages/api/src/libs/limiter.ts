import { MemoryRatelimiter } from "@orpc/experimental-ratelimit/memory";

export const limiter = new MemoryRatelimiter({
	maxRequests: 60,
	window: 60_000,
});
