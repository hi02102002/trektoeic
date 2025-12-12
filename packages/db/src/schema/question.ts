import { SIZE_OF_ID } from "@trektoeic/utils/create-id";
import { integer, jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";
import { kits } from "./kit";

export const questions = pgTable("questions", {
	...DEFAULT_SCHEMA,
	part: integer("part").notNull(),
	position: varchar("position", {
		length: 10,
	}).notNull(),
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
	total: integer("count").notNull().default(1),
	kitId: varchar("kit_id", {
		length: SIZE_OF_ID,
	})
		.notNull()
		.references(() => kits.id, { onDelete: "cascade" }),
});

export const subQuestions = pgTable("sub_questions", {
	...DEFAULT_SCHEMA,
	questionId: varchar("question_id", {
		length: SIZE_OF_ID,
	})
		.notNull()
		.references(() => questions.id, { onDelete: "cascade" }),
	position: integer("position").notNull(),
	question: text("question").notNull(),
	options: jsonb("options")
		.$type<{
			[key: string]: string;
		}>()
		.notNull(),
	ans: varchar("ans").notNull(),
	translation: jsonb("translation")
		.$type<{
			[key: string]: string;
		}>()
		.notNull(),
});
