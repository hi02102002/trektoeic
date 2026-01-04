import type { LoggerContext } from "@orpc/experimental-pino";
import { auth } from "@trektoeic/auth";
import { type Database, db } from "@trektoeic/db/db";
import type { getRedisClient } from "./libs/ioredis";
import type { storage } from "./libs/storage";

export async function createContext({ headers }: { headers: any }) {
	try {
		const session = await auth.api.getSession({
			headers: headers,
		});
		return {
			db,
			session,
		};
	} catch {
		return {
			session: null,
			db,
		};
	}
}

type AuthContext = NonNullable<Awaited<ReturnType<typeof createContext>>>;

export interface Context extends LoggerContext {
	session: AuthContext["session"];
	redis?: ReturnType<typeof getRedisClient>;
	kv?: typeof storage;
	db: Database;
}
