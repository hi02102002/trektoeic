import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";
import { user } from "./auth";

export const history = pgTable(
	"histories",
	{
		...DEFAULT_SCHEMA,
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		action: varchar("action", {
			length: 50,
		})
			.$type<"practice_part">()
			.notNull(),
		metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull(),
		contents: jsonb("contents").$type<unknown>().notNull(),
	},
	(tb) => ({
		idxUserIdAction: index("idx_histories_user_id_action").on(
			tb.userId,
			tb.action,
		),
		idxUserIdActionMetadataPart: index(
			"idx_histories_user_id_action_metadata_part",
		).on(tb.userId, tb.action, sql`(${tb.metadata}->>'part')`),
		idxMetadataGin: index("idx_histories_metadata_gin").using(
			"gin",
			tb.metadata,
		),
		idxCreatedAt: index("idx_histories_created_at").on(tb.createdAt),
		idxUserIdCreatedAt: index("idx_histories_user_id_created_at").on(
			tb.userId,
			tb.createdAt,
		),
	}),
);
