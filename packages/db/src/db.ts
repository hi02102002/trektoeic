import { env } from "@trektoeic/env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle(env.DATABASE_URL, {
	schema,
	logger: env.NODE_ENV !== "production",
});

export type Database = typeof db;
