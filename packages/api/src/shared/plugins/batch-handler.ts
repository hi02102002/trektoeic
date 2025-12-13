import type { Context } from "@orpc/server";
import { BatchHandlerPlugin } from "@orpc/server/plugins";

export const batchHandler = <T extends Context>() => {
	return new BatchHandlerPlugin<T>();
};
