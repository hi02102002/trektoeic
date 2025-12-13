import { redisProviderMiddleware } from "../middlewares";
import { o } from "./o";

export const publicProcedure = o.use(redisProviderMiddleware);
