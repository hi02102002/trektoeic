import { createId } from "@trektoeic/utils/create-id";
import { text, timestamp } from "drizzle-orm/pg-core";

export const DEFAULT_SCHEMA = {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
} as const;
