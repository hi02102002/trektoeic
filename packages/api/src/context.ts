import type { LoggerContext } from "@orpc/experimental-pino";
import type { Ratelimiter } from "@orpc/experimental-ratelimit";
import type {
	RequestHeadersPluginContext,
	ResponseHeadersPluginContext,
} from "@orpc/server/plugins";
import { auth } from "@trektoeic/auth";
import { kysely } from "@trektoeic/db";
import { type Database, db } from "@trektoeic/db/db";
import type { KyselyDb } from "@trektoeic/db/types/index";
import type { storage } from "./libs/storage";

export async function createContext({ headers }: { headers: any }) {
	try {
		const session = await auth.api.getSession({
			headers: headers,
		});
		return {
			db,
			session,
			kysely,
		};
	} catch {
		return {
			session: null,
			db,
			kysely,
		};
	}
}

type AuthContext = NonNullable<Awaited<ReturnType<typeof createContext>>>;

export type Context = LoggerContext & {
	session: AuthContext["session"];
	kv?: typeof storage;
	db: Database;
	kysely: KyselyDb;
	limiter?: Ratelimiter;
} & ResponseHeadersPluginContext &
	RequestHeadersPluginContext;
