import type { VocabularyReviewState } from "@trektoeic/schemas/vocabulary-review-schema";
import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";
import { user } from "./auth";
import { vocabularies } from "./vocabulary";

export const vocabularyReviewCards = pgTable(
	"vocabulary_review_cards",
	{
		...DEFAULT_SCHEMA,
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		vocabularyId: text("vocabulary_id")
			.notNull()
			.references(() => vocabularies.id, { onDelete: "cascade" }),
		state: text("state")
			.$type<VocabularyReviewState>()
			.notNull()
			.default("new"),
		repetitions: integer("repetitions").notNull().default(0),
		lapses: integer("lapses").notNull().default(0),
		intervalDays: integer("interval_days").notNull().default(0),
		easeFactor: integer("ease_factor").notNull().default(250),
		nextReviewAt: timestamp("next_review_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
	},
	(table) => [
		unique("vocabulary_review_cards_user_vocab_unique").on(
			table.userId,
			table.vocabularyId,
		),
		index("vocabulary_review_cards_user_id_next_review_at_idx").on(
			table.userId,
			table.nextReviewAt,
		),
		index("vocabulary_review_cards_user_id_state_idx").on(
			table.userId,
			table.state,
		),
		index("vocabulary_review_cards_vocabulary_id_idx").on(table.vocabularyId),
	],
);
