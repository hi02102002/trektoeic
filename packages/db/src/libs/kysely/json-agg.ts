import { type Expression, type RawBuilder, sql } from "kysely";

export function kJsonAggBuildObject<TOutput extends Record<string, unknown>>(
	shape: {
		[K in keyof TOutput]: Expression<TOutput[K]>;
	},
	options?: {
		orderBy?: Expression<unknown>;
		filterNotNull?: Expression<unknown>;
	},
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

export function kJsonAggBuildObjectAs<
	TOutput,
	TShape extends Record<string, Expression<unknown>> = Record<
		string,
		Expression<unknown>
	>,
>(
	shape: TShape,
	options?: {
		orderBy?: Expression<unknown>;
		filterNotNull?: Expression<unknown>;
	},
): RawBuilder<TOutput[]> {
	return kJsonAggBuildObject(shape, options) as unknown as RawBuilder<
		TOutput[]
	>;
}
