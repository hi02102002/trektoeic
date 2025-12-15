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
		introAudio: text("intro_audio").default(""),
		introImage: text("intro_image").default(""),
		introAnswer: text("intro_answer").default(""),
		part: integer("part").notNull(),
	},
	(tb) => ({
		indexPart: index("idx_sections_part").on(tb.part),
	}),
);
