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

/**
 * Higher-order function that wraps a function to provide database and user ID context.
 *
 * @template TArgs - The types of arguments that the wrapped function will accept
 * @template TReturn - The return type of the wrapped function
 *
 * @param fn - A function that takes a database instance and user ID, and returns a function that accepts TArgs and returns TReturn
 * @returns A curried function that first accepts a database instance and user ID, then returns the result of calling fn with those parameters
 *
 * @example
 * ```typescript
 * const getUserById = withDbAndUser((db, userId) => (id: string) => {
 *   return db.query.users.findFirst({ where: eq(users.id, id) });
 * });
 *
 * const getUser = getUserById(database, "user123");
 * const user = getUser("targetUserId");
 * ```
 */
export const withDbAndUser =
	<TArgs extends unknown[], TReturn>(
		fn: ({
			db,
			userId,
		}: {
			db?: Database;
			userId: string;
		}) => (...args: TArgs) => TReturn,
	) =>
	(userId: string, database: Database = db) =>
		fn({ db: database, userId });
