import { env } from "@trektoeic/env";
import pino, { type Logger } from "pino";

export type LoggerMeta = {
	service: string;
	env?: string;
	version?: string;
};

export type CreateLoggerOptions = {
	meta: LoggerMeta;
	level?: string;
};

export function createLogger({ meta, level }: CreateLoggerOptions): Logger {
	return pino({
		level: level ?? process.env.LOG_LEVEL ?? "info",
		base: {
			env: meta.env ?? env.NODE_ENV,
			service: meta.service,
			version: meta.version,
		},
		redact: [
			"password",
			"token",
			"authorization",
			"*.authorization",
			"*.password",
		],
		serializers: {
			err: pino.stdSerializers.err,
		},
	});
}
