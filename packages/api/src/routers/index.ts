import type { RouterClient } from "@orpc/server";
import { practices } from "./practices";

export const appRouter = {
	practices,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
