import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
} from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";

export const vocabularyCategories = pgTable(
	"vocabulary_categories",
	{
		...DEFAULT_SCHEMA,
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		alias: text("alias"),
		level: integer("level").notNull().default(1),
		parentId: text("parent_id"),
		hasChild: boolean("has_child").default(false).notNull(),
	},
	(table) => [
		// Index for parent-child hierarchy queries
		index("vocabulary_categories_parent_id_idx").on(table.parentId),
		// Index for level filtering
		index("vocabulary_categories_level_idx").on(table.level),
	],
);

export const vocabularies = pgTable(
	"vocabularies",
	{
		...DEFAULT_SCHEMA,
		categoryId: text("category_id")
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
	},
	(table) => [
		// FK index - PostgreSQL doesn't auto-create these
		index("vocabularies_category_id_idx").on(table.categoryId),
		// Index for name search
		index("vocabularies_name_idx").on(table.name),
	],
);
