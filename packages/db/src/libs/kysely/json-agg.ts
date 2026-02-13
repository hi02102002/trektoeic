import { type Expression, type RawBuilder, sql } from "kysely";

type JsonAggOptions = {
	orderBy?: Expression<unknown>;
	filterNotNull?: Expression<unknown>;
};

/**
 * Build `json_agg(json_build_object(...))` with end-to-end type inference.
 *
 * Mental model:
 * - `shape` is SQL expressions for each JSON field.
 * - `TOutput` is the final plain object type returned by SQL.
 */
export function kJsonAggBuildObject<TOutput extends Record<string, unknown>>(
	shape: {
		// Each output key maps to an expression that resolves to the same value type.
		[K in keyof TOutput]: Expression<TOutput[K]>;
	},
	options?: JsonAggOptions,
) {
	const entries = Object.entries(shape);

	return sql<TOutput[]>`
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

/**
 * Same SQL builder, but lets callers pin a domain type explicitly for nicer hover.
 * Useful when TS would otherwise display expanded inferred internals.
 */
export function kJsonAggBuildObjectAs<
	TOutput,
	TShape extends Record<string, Expression<unknown>> = Record<
		string,
		Expression<unknown>
	>,
>(shape: TShape, options?: JsonAggOptions): RawBuilder<TOutput[]> {
	return kJsonAggBuildObject(shape, options) as unknown as RawBuilder<
		TOutput[]
	>;
}
