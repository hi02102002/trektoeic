import type {
	InferRouterInputs,
	InferRouterOutputs,
	RouterClient,
} from "@orpc/server";
import { kitsRouter } from "./kits";
import { mockTestRouter } from "./mock-test.router";
import { partPractices } from "./part-practices";
import { questions } from "./questions";
import { partSections } from "./sections";

export const appRouter = {
	questions,
	partSections,
	partPractices,
	kits: kitsRouter,
	mockTest: mockTestRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
export type AppRouterInputs = InferRouterInputs<typeof appRouter>;
export type AppRouterOutputs = InferRouterOutputs<typeof appRouter>;
