import type {
	InferRouterInputs,
	InferRouterOutputs,
	RouterClient,
} from "@orpc/server";
import { kitsRouter } from "./kits";
import { partPractices } from "./part-practices";
import { questions } from "./questions";
import { partSections } from "./sections";

export const appRouter = {
	questions,
	partSections,
	partPractices,
	kits: kitsRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
export type AppRouterInputs = InferRouterInputs<typeof appRouter>;
export type AppRouterOutputs = InferRouterOutputs<typeof appRouter>;
