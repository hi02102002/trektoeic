import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";

export const kits = pgTable("kits", {
	...DEFAULT_SCHEMA,
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
	year: integer("year").notNull(),
});
