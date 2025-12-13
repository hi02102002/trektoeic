import { BatchHandlerPlugin } from "@orpc/server/plugins";

export const batchHandler = () => {
	return new BatchHandlerPlugin();
};
