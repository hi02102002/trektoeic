import { type Expression, type RawBuilder, sql } from "kysely";

type JsonAggOptions = {
	orderBy?: Expression<unknown>;
	filterNotNull?: Expression<unknown>;
};

type JsonObjectShapeOptions = {
	nullIf?: Expression<unknown>;
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

export function kJsonObjectAgg<TOutput extends Record<string, unknown>>(
	shape: {
		[K in keyof TOutput]: Expression<TOutput[K]>;
	},
	options?: JsonObjectShapeOptions,
): RawBuilder<TOutput | null>;
export function kJsonObjectAgg<TKey extends string, TValue>(
	keyExpr: Expression<TKey>,
	valueExpr: Expression<TValue>,
): RawBuilder<Record<TKey, TValue>>;
/**
 * Build either:
 * - a single object from shape: `json_agg(json_build_object(...))->0`
 * - a map object from key/value: `json_object_agg(key_expr, value_expr)`
 *
 * Shape example:
 * ```ts
 * const review = kJsonObjectAgg(
 *   jsonColsFromNames(eb, "vrc", drizzleColumnNames(vocabularyReviewCards)),
 *   { nullIf: eb.ref("vrc.id") }
 * );
 * ```
 *
 * Key/value example:
 * ```ts
 * // {"easy": 3, "medium": 7, "hard": 2}
 * const byLevel = kJsonObjectAgg(
 *   eb.ref("v.level"),
 *   eb.ref("v.total")
 * );
 * ```
 */
export function kJsonObjectAgg(
	shapeOrKeyExpr: Expression<unknown> | Record<string, Expression<unknown>>,
	valueExprOrOptions?: Expression<unknown> | JsonObjectShapeOptions,
) {
	const isExpression = (v: unknown): v is Expression<unknown> => {
		return (
			typeof v === "object" &&
			v !== null &&
			"toOperationNode" in (v as Record<string, unknown>)
		);
	};

	// Overload 1: kJsonObjectAgg(shape, options?)
	if (!isExpression(shapeOrKeyExpr) || !isExpression(valueExprOrOptions)) {
		const shape = shapeOrKeyExpr as Record<string, Expression<unknown>>;
		const options = valueExprOrOptions as JsonObjectShapeOptions | undefined;
		const entries = Object.entries(shape);

		if (options?.nullIf) {
			return sql<Record<string, unknown> | null>`
        (
          json_agg(
            json_build_object(
              ${sql.join(
								entries.flatMap(([key, expr]) => [sql.raw(`'${key}'`), expr]),
								sql.raw(", "),
							)}
            )
          ) filter (where ${options.nullIf} is not null)
        )->0
      `;
		}

		return sql<Record<string, unknown>>`
			coalesce(
				(
					json_agg(
						json_build_object(
							${sql.join(
								entries.flatMap(([key, expr]) => [sql.raw(`'${key}'`), expr]),
								sql.raw(", "),
							)}
						)
					)
				)->0,
				'{}'::json
			)
		`;
	}

	// Overload 2: kJsonObjectAgg(keyExpr, valueExpr)
	const keyExpr = shapeOrKeyExpr;
	const valueExpr = valueExprOrOptions;

	return sql<Record<string, unknown>>`
    coalesce(
      json_object_agg(
        ${keyExpr},
        ${valueExpr}
      ),
      '{}'::json
    )
  `;
}
