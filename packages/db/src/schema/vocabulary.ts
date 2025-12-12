import {
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	varchar,
} from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";

export const vocabularyCategories = pgTable("vocabulary_categories", {
	...DEFAULT_SCHEMA,
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	alias: text("alias"),
	level: integer("level").notNull().default(1),
	parentId: varchar("parent_id"),
	hasChild: boolean("has_child").default(false).notNull(),
});

export const vocabularies = pgTable("vocabularies", {
	...DEFAULT_SCHEMA,
	categoryId: varchar("category_id")
		.notNull()
		.references(() => vocabularyCategories.id, { onDelete: "cascade" }),
	name: text("name"),
	example: text("example"),
	meaning: text("meaning"),
	spelling: text("spelling"),
	type: text("type"),
	detailType: text("detail_type"),
	image: text("image"),
	collection: jsonb("collection").$type<{
		uk?: { spell: string; sound: string };
		us?: { spell: string; sound: string };
	}>(),
});
