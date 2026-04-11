import {
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	unique,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";
import { user } from "./auth";

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

/** Người dùng đánh dấu chủ đề ngữ pháp đã học. */
export const grammarTopicStudied = pgTable(
	"grammar_topic_studied",
	{
		...DEFAULT_SCHEMA,
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		topicId: text("topic_id")
			.notNull()
			.references(() => grammarTopics.id, { onDelete: "cascade" }),
		studiedAt: timestamp("studied_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		unique("grammar_topic_studied_user_topic_unique").on(
			table.userId,
			table.topicId,
		),
		index("grammar_topic_studied_user_id_idx").on(table.userId),
		index("grammar_topic_studied_topic_id_idx").on(table.topicId),
	],
);
