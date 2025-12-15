import type { LoggerContext } from "@orpc/experimental-pino";
import { auth } from "@trektoeic/auth";
import type { getRedisClient } from "./libs/ioredis";

export async function createContext({ headers }: { headers: any }) {
	try {
		const session = await auth.api.getSession({
			headers: headers,
		});
		return {
			session,
		};
	} catch {
		return {
			session: null,
		};
	}
}

type AuthContext = NonNullable<Awaited<ReturnType<typeof createContext>>>;

export interface Context extends LoggerContext {
	session: AuthContext["session"];
	redis?: ReturnType<typeof getRedisClient>;
}
