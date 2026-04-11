import {
	index,
	integer,
	jsonb,
	pgTable,
	text,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";

export const grammarCourses = pgTable(
	"grammar_courses",
	{
		...DEFAULT_SCHEMA,
		slug: text("slug").notNull(),
		title: text("title").notNull(),
		description: text("description").notNull().default(""),
		sortOrder: integer("sort_order").notNull().default(0),
	},
	(table) => [uniqueIndex("grammar_courses_slug_unique").on(table.slug)],
);

export const grammarTopics = pgTable(
	"grammar_topics",
	{
		...DEFAULT_SCHEMA,
		courseId: text("course_id")
			.notNull()
			.references(() => grammarCourses.id, { onDelete: "cascade" }),
		slug: text("slug").notNull(),
		title: text("title").notNull(),
		description: text("description").notNull(),
		/** HTML lý thuyết gốc; hiển thị thay cho / bổ sung sections. */
		lessonHtml: text("lesson_html"),
		/** Nhãn dạng bài tập (vd. "Điền từ vào chỗ trống") */
		exerciseTypeName: text("exercise_type_name").notNull().default(""),
		exerciseTypeDes: text("exercise_type_des").notNull().default(""),
		relatedParts: jsonb("related_parts").$type<number[]>().notNull(),
		sortOrder: integer("sort_order").notNull().default(0),
	},
	(table) => [
		uniqueIndex("grammar_topics_slug_unique").on(table.slug),
		index("grammar_topics_course_id_idx").on(table.courseId),
	],
);

export const grammarSections = pgTable(
	"grammar_sections",
	{
		...DEFAULT_SCHEMA,
		topicId: text("topic_id")
			.notNull()
			.references(() => grammarTopics.id, { onDelete: "cascade" }),
		heading: text("heading").notNull(),
		body: jsonb("body").$type<string[]>().notNull(),
		sortOrder: integer("sort_order").notNull().default(0),
	},
	(table) => [index("grammar_sections_topic_id_idx").on(table.topicId)],
);

export const grammarExercises = pgTable(
	"grammar_exercises",
	{
		...DEFAULT_SCHEMA,
		topicId: text("topic_id")
			.notNull()
			.references(() => grammarTopics.id, { onDelete: "cascade" }),
		exerciseKey: text("exercise_key").notNull(),
		/** mcq4 = a–d; mcq2 = a–b (type 3); fill = điền từ (type 4) */
		exerciseKind: text("exercise_kind").notNull().default("mcq4"),
		prompt: text("prompt").notNull(),
		options: jsonb("options").$type<[string, string, string, string]>(),
		correctIndex: integer("correct_index"),
		fillAnswer: text("fill_answer"),
		hintKeyword: text("hint_keyword"),
		explanation: text("explanation").notNull(),
		sortOrder: integer("sort_order").notNull().default(0),
	},
	(table) => [
		index("grammar_exercises_topic_id_idx").on(table.topicId),
		uniqueIndex("grammar_exercises_topic_exercise_key_unique").on(
			table.topicId,
			table.exerciseKey,
		),
	],
);
