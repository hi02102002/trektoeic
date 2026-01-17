import { index, integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";
import { kits } from "./kit";

export const questions = pgTable(
	"questions",
	{
		...DEFAULT_SCHEMA,
		part: integer("part").notNull(),
		position: text("position").notNull(),
		audioUrl: text("audio_url"),
		imageUrl: text("image_url"),
		teaser: jsonb("teaser")
			.$type<{
				text: string;
				tran: {
					[key: string]: string;
				};
			}>()
			.default({
				text: "",
				tran: {
					vi: "",
				},
			}),
		count: integer("count").notNull().default(1),
		kitId: text("kit_id")
			.notNull()
			.references(() => kits.id, { onDelete: "cascade" }),
	},
	(table) => [
		index("questions_kit_id_idx").on(table.kitId),
		index("questions_kit_id_part_idx").on(table.kitId, table.part),
		index("questions_part_idx").on(table.part),
	],
);

export const subQuestions = pgTable(
	"sub_questions",
	{
		...DEFAULT_SCHEMA,
		questionId: text("question_id")
			.notNull()
			.references(() => questions.id, { onDelete: "cascade" }),
		position: integer("position").notNull(),
		question: text("question").notNull(),
		options: jsonb("options")
			.$type<{
				[key: string]: string;
			}>()
			.notNull()
			.default({}),
		ans: text("ans").notNull(),
		translation: jsonb("translation")
			.$type<{
				[key: string]: string;
			}>()
			.notNull()
			.default({}),
	},
	(table) => [
		// FK index - PostgreSQL doesn't auto-create these
		index("sub_questions_question_id_idx").on(table.questionId),
		// Composite index for ordering sub-questions within a question
		index("sub_questions_question_id_position_idx").on(
			table.questionId,
			table.position,
		),
	],
);
