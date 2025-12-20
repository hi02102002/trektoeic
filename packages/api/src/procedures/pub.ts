import { redisProviderMiddleware } from "../middlewares";
import { kvProviderMiddleware } from "../middlewares/kv-middleware";
import { o } from "./o";

export const publicProcedure = o
	.use(redisProviderMiddleware)
	.use(kvProviderMiddleware);
