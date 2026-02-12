import { dbProviderMiddleware } from "../middlewares";
import { kvProviderMiddleware } from "../middlewares/kv-middleware";
import { kyselyProviderMiddleware } from "../middlewares/kysely-middleware";
import { o } from "./o";

export const publicProcedure = o
	.use(dbProviderMiddleware)
	.use(kvProviderMiddleware)
	.use(kyselyProviderMiddleware);
