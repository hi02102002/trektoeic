import type { Kysely } from "kysely";
import type { KyselyDatabase } from "../types";

export const withKysely =
	<TArgs extends unknown[], TReturn>(
		fn: (db: Kysely<KyselyDatabase>) => (...args: TArgs) => TReturn,
	) =>
	(db: Kysely<KyselyDatabase>) =>
		fn(db);

export const withUserAndKysely =
	<TArgs extends unknown[], TReturn>(
		fn: (
			userId: string,
			db: Kysely<KyselyDatabase>,
		) => (...args: TArgs) => TReturn,
	) =>
	(userId: string, db: Kysely<KyselyDatabase>) =>
		fn(userId, db);
