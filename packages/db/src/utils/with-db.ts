import { type Database, db } from "../db";

/**
 * Higher-order function that creates a curried function with database dependency injection.
 *
 * @template TArgs - The tuple type of arguments that the inner function accepts
 * @template TReturn - The return type of the inner function
 *
 * @param fn - A function that takes a database instance and returns another function
 * @returns A curried function that accepts an optional database instance and returns the result of calling `fn` with that database
 *
 * @example
 * ```typescript
 * const getUserById = withDb((db: Database) => (id: string) => {
 *   return db.query('SELECT * FROM users WHERE id = ?', [id]);
 * });
 *
 * const getUser = getUserById(); // Uses default db
 * const user = getUser('123');
 * ```
 */
export const withDb =
	<TArgs extends unknown[], TReturn>(
		fn: (db: Database) => (...args: TArgs) => TReturn,
	) =>
	(database: Database = db) =>
		fn(database);
