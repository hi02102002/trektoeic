import type { Table } from "drizzle-orm";
import type { Kyselify } from "drizzle-orm/kysely";
import type { ColumnType, Kysely } from "kysely";
import type * as schema from "../schema";

export type SnakeToCamelCase<S extends string> =
	S extends `${infer Head}_${infer Tail}`
		? `${Head}${Capitalize<SnakeToCamelCase<Tail>>}`
		: S;

type IsColumnType<T> = T extends ColumnType<any, any, any> ? true : false;

export type DeepCamelCaseKeys<T> = {
	[K in keyof T as K extends string
		? SnakeToCamelCase<K>
		: K]: T[K] extends Date
		? T[K]
		: IsColumnType<T[K]> extends true
			? T[K] // don't recurse into ColumnType
			: T[K] extends object
				? DeepCamelCaseKeys<T[K]>
				: T[K];
};

type RawTableMap = {
	[K in keyof typeof schema as (typeof schema)[K] extends Table
		? (typeof schema)[K]["_"]["name"]
		: never]: (typeof schema)[K] extends Table
		? Kyselify<(typeof schema)[K]>
		: never;
};

export type KyselyDatabase = {
	[K in keyof RawTableMap as SnakeToCamelCase<K & string>]: DeepCamelCaseKeys<
		RawTableMap[K]
	>;
};

export type KyselyDb = Kysely<KyselyDatabase>;
