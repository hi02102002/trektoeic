import type { LoggerContext } from "@orpc/experimental-pino";
import { auth } from "@trektoeic/auth";

export async function createContext({ req }: { req: Request }) {
	try {
		const session = await auth.api.getSession({
			headers: req.headers,
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
}
