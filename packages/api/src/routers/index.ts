import type { RouterClient } from "@orpc/server";
import { partPractices } from "./part-practices";
import { questions } from "./questions";
import { partSections } from "./sections";

export const appRouter = {
	questions,
	partSections,
	partPractices,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
