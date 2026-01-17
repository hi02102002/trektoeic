import type { ExpressionBuilder } from "kysely";
import { type Expression, sql } from "kysely";

export { sql as kSql } from "kysely";

import { getTableColumns } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

export function drizzleColumnNames<T extends PgTable>(
	table: T,
): readonly (keyof T["_"]["columns"] & string)[] {
	return Object.keys(getTableColumns(table)) as any;
}

export function selectColsFromNames<DB>(
	eb: ExpressionBuilder<DB, any>,
	alias: string,
	cols: readonly string[],
) {
	return cols.map((c) => eb.ref(`${alias}.${c}` as any).as(c));
}
export function jsonColsFromNames<DB>(
	eb: ExpressionBuilder<DB, any>,
	alias: string,
	cols: readonly string[],
) {
	return Object.fromEntries(
		cols.map((c) => [c, eb.ref(`${alias}.${c}` as any)]),
	) as Record<string, any>;
}

type InferExpr<T> = T extends Expression<infer R> ? R : never;

type InferShape<T extends Record<string, Expression<any>>> = {
	[K in keyof T]: InferExpr<T[K]>;
};

export function kJsonAggBuildObject<
	TShape extends Record<string, Expression<any>>,
>(
	shape: TShape,
	options?: {
		orderBy?: Expression<any>;
		filterNotNull?: Expression<any>;
	},
) {
	const entries = Object.entries(shape);

	return sql<InferShape<TShape>[]>`
    coalesce(
      json_agg(
        json_build_object(
          ${sql.join(
						entries.flatMap(([key, expr]) => [sql.raw(`'${key}'`), expr]),
						sql.raw(", "),
					)}
        )
        ${options?.orderBy ? sql`order by ${options.orderBy}` : sql``}
      )
      ${
				options?.filterNotNull
					? sql`filter (where ${options.filterNotNull} is not null)`
					: sql``
			},
      '[]'::json
    )
  `;
}
