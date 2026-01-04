import { type SQL, sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

/**
 * Generates a SQL expression to find the position of a value in an array.
 *
 * @template T - The type of elements in the array
 * @param arr - The array to search in
 * @param value - The value to find the position of
 * @returns A SQL expression that evaluates to the 1-based index of the value in the array, or null if not found
 *
 * @example
 * ```typescript
 * const position = arrayPosition([1, 2, 3], 2);
 * // Generates: ARRAY_POSITION(ARRAY[1, 2, 3], 2)
 * ```
 */
export const arrayPosition = <T>(arr: T[], value: AnyPgColumn) => {
	return sql`ARRAY_POSITION(ARRAY[${sql.join(
		arr.map((item) => sql`${item}`),
		sql`, `,
	)}], ${value})` as SQL<number>;
};
