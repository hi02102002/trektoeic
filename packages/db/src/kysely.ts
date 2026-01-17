import { env } from "@trektoeic/env";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { pool } from "./db";
import type { KyselyDatabase } from "./types";

export const kysely = new Kysely<KyselyDatabase>({
	dialect: new PostgresDialect({ pool }),
	plugins: [new CamelCasePlugin()],
	log: env.NODE_ENV === "development" ? ["error", "query"] : undefined,
});
