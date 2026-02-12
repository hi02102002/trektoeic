import { getTableColumns } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type {
	Expression,
	ExpressionBuilder,
	SelectExpression,
	SelectType,
	StringReference,
} from "kysely";

export function drizzleColumnNames<T extends PgTable>(
	table: T,
): readonly (keyof T["_"]["columns"] & string)[] {
	return Object.keys(
		getTableColumns(table),
	) as unknown as readonly (keyof T["_"]["columns"] & string)[];
}

type ColumnName<DB, TAlias extends keyof DB & string> = keyof DB[TAlias] &
	string;

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
