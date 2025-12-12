import { requireAuth } from "../middlewares";
import { publicProcedure } from "./pub";

export const requiredAuthProcedure = publicProcedure.use(requireAuth);
