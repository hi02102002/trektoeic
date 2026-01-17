import { index, integer, pgTable, text } from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";

export const sections = pgTable(
	"sections",
	{
		...DEFAULT_SCHEMA,
		name: text("question").default(""),
		title: text("title").default(""),
		titleVi: text("title_vi").default(""),
		sectionTitle: text("section_title").default(""),
		sectionDes: text("section_des").default(""),
		intro: text("intro").default(""),
		introVi: text("intro_vi").default(""),
		introAudio: text("intro_audio"),
		introImage: text("intro_image"),
		introAnswer: text("intro_answer"),
		part: integer("part").notNull(),
	},
	(table) => [index("sections_part_idx").on(table.part)],
);
