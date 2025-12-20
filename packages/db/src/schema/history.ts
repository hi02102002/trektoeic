import { index, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";
import { user } from "./auth";

export const history = pgTable(
	"histories",
	{
		...DEFAULT_SCHEMA,
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		action: text("action").$type<"practice_part">().notNull(),
		metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull(),
		contents: jsonb("contents").$type<unknown>().notNull(),
	},
	(tb) => ({
		idxUserId: index("idx_histories_user_id").on(tb.userId),
		idxAction: index("idx_histories_action").on(tb.action),
	}),
);
