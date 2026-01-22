import type { HistoryAction } from "@trektoeic/schemas/history-schema";
import { sql } from "drizzle-orm";
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
		action: text("action").$type<HistoryAction>().notNull(),
		metadata: jsonb("metadata")
			.$type<Record<string, unknown>>()
			.notNull()
			.default({}),
		contents: jsonb("contents").$type<unknown>().notNull().default({}),
	},
	(tb) => [
		index("histories_user_id_action_idx").on(tb.userId, tb.action),
		index("histories_user_id_created_at_idx").on(
			tb.userId,
			tb.createdAt.desc(),
		),
		index("histories_user_action_metadata_part_idx").on(
			tb.userId,
			tb.action,
			sql`(${tb.metadata}->>'part')`,
		),
		index("histories_user_action_metadata_kit_id_idx").on(
			tb.userId,
			tb.action,
			sql`(${tb.metadata}->>'kitId')`,
		),
		index("histories_metadata_gin_idx").using("gin", tb.metadata),
	],
);
