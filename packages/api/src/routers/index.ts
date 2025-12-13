import type { RouterClient } from "@orpc/server";
import { questions } from "./questions";

export const appRouter = {
	questions,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
