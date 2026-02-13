import { getTableColumns } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type {
	Expression,
	ExpressionBuilder,
	SelectExpression,
	SelectType,
	StringReference,
} from "kysely";

/**
 * Get column name strings from a Drizzle table definition.
 * Useful when you want to reuse Drizzle schema metadata in Kysely helpers.
 */
export function drizzleColumnNames<T extends PgTable>(
	table: T,
): readonly (keyof T["_"]["columns"] & string)[] {
	return Object.keys(
		getTableColumns(table),
	) as unknown as readonly (keyof T["_"]["columns"] & string)[];
}

// Valid column names for a concrete alias in the current DB shape.
type ColumnName<DB, TAlias extends keyof DB & string> = keyof DB[TAlias] &
	string;

/**
 * Build select expressions like:
 *   alias.colA as colA, alias.colB as colB, ...
 *
 * Mental model:
 * - `alias` chooses which table/alias to read from.
 * - `cols` is constrained to valid columns of that alias.
 * - output is a list of Kysely select expressions.
 */
export function selectColsFromNames<
	DB,
	TTables extends keyof DB & string,
	TAlias extends TTables,
	TCols extends readonly ColumnName<DB, TAlias>[],
>(
	eb: ExpressionBuilder<DB, TTables>,
	alias: TAlias,
	cols: TCols,
): SelectExpression<DB, TTables>[] {
	return cols.map(
		(c) =>
			eb
				.ref(`${alias}.${c}` as unknown as StringReference<DB, TTables>)
				.as(c) as SelectExpression<DB, TTables>,
	);
}

/**
 * Build a JSON-object "shape" from alias + column names:
 *   { id: ref("alias.id"), name: ref("alias.name"), ... }
 *
 * This is mainly used as input for JSON aggregate helpers.
 */
export function jsonColsFromNames<
	DB,
	TTables extends keyof DB & string,
	TAlias extends TTables,
	TCols extends readonly ColumnName<DB, TAlias>[],
>(
	eb: ExpressionBuilder<DB, TTables>,
	alias: TAlias,
	cols: TCols,
): {
	// Key comes from selected column names; value is the underlying selected type.
	[K in TCols[number]]: Expression<SelectType<DB[TAlias][K]>>;
} {
	return cols.reduce(
		(acc, col) => {
			acc[col] = eb.ref(
				`${alias}.${col}` as unknown as StringReference<DB, TTables>,
			) as Expression<SelectType<DB[TAlias][typeof col]>>;
			return acc;
		},
		{} as {
			[K in TCols[number]]: Expression<SelectType<DB[TAlias][K]>>;
		},
	);
}
