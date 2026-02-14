import { sql } from "kysely";

export const now = () => {
	return sql`now()`;
};
