import type { RouterClient } from "@orpc/server";
import { questions } from "./questions";
import { partSections } from "./sections";

export const appRouter = {
	questions,
	partSections,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
