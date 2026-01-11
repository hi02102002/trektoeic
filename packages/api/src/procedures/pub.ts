import { dbProviderMiddleware, redisProviderMiddleware } from "../middlewares";
import { kvProviderMiddleware } from "../middlewares/kv-middleware";
import { kyselyProviderMiddleware } from "../middlewares/kysely-middleware";
import { o } from "./o";

export const publicProcedure = o
	.use(dbProviderMiddleware)
	.use(redisProviderMiddleware)
	.use(kvProviderMiddleware)
	.use(kyselyProviderMiddleware);
