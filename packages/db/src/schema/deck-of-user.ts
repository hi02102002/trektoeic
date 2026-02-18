import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";
import { user } from "./auth";

export const deckOfUsers = pgTable(
	"deck_of_users",
	{
		...DEFAULT_SCHEMA,
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		categoryId: text("category_id").notNull(),
	},
	(table) => [
		uniqueIndex("deck_of_user_user_id_category_id_unique").on(
			table.userId,
			table.categoryId,
		),
	],
);
