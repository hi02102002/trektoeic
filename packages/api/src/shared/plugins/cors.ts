import type { Context } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import { env } from "@trektoeic/env";

export const cors = <T extends Context>() => {
	return new CORSPlugin<T>({
		credentials: true,
		origin: env.CORS_ORIGIN,
	});
};
