import { CORSPlugin } from "@orpc/server/plugins";
import { env } from "@trektoeic/env";

export function cors() {
	return new CORSPlugin({
		credentials: true,
		origin: env.CORS_ORIGIN,
	});
}
