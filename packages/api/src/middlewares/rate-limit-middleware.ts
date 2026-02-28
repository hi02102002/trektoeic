import { createRatelimitMiddleware } from "@orpc/experimental-ratelimit";
import type { Context } from "../context";
import { limiter } from "../libs/limiter";

export const rateLimitMiddleware = createRatelimitMiddleware<Context>({
	limiter: ({ context }) => context.limiter ?? limiter,
	key: ({ path }, input) =>
		`${JSON.stringify({
			path,
			input,
		})}`,
});
