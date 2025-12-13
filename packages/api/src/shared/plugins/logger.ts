import { LoggingHandlerPlugin } from "@orpc/experimental-pino";
import type { Context } from "@orpc/server";
import { createLogger } from "@trektoeic/logger";
import { createId } from "@trektoeic/utils/create-id";

const pino = createLogger({
	meta: {
		service: "API",
	},
});

export const logger = <T extends Context>() => {
	return new LoggingHandlerPlugin<T>({
		logger: pino,
		generateId: () => createId(),
		logRequestAbort: true,
		logRequestResponse: true,
	});
};
