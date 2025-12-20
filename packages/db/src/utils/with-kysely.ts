import type { Kysely } from "kysely";
import type { KyselyDatabase } from "../types";

export const withKysely =
	<TArgs extends unknown[], TReturn>(
		fn: (db: Kysely<KyselyDatabase>) => (...args: TArgs) => TReturn,
	) =>
	(db: Kysely<KyselyDatabase>) =>
		fn(db);
