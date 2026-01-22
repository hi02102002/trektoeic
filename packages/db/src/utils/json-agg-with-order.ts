import { type AnyColumn, getTableColumns, sql } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

export const jsonAggBuildObjectWithOrder = <T extends PgTable>(
	table: T,
	orderByColumn: PgColumn | AnyColumn,
	notNullColumn: PgColumn | AnyColumn,
) => {
	const cols = getTableColumns(table);
	const colEntries = Object.entries(cols);

	return sql`
    COALESCE(
      json_agg(
        json_build_object(
          ${sql.join(
						colEntries.flatMap(([key, col]) => [sql.raw(`'${key}'`), col]),
						sql.raw(", "),
					)}
        )
        ORDER BY ${orderByColumn}
      ) FILTER (WHERE ${notNullColumn} IS NOT NULL),
      '[]'::json
    )
  `;
};
