import { pgTable, text } from "drizzle-orm/pg-core";
import { DEFAULT_SCHEMA } from "../constants";

export const sections = pgTable("sections", {
	...DEFAULT_SCHEMA,
	name: text("question").default(""),
	title: text("title").default(""),
	sectionTitle: text("section_title").default(""),
	sectionDes: text("section_des").default(""),
	intro: text("intro").default(""),
	introVi: text("intro_vi").default(""),
	introAudio: text("intro_audio").default(""),
	introImage: text("intro_image").default(""),
	introAnswer: text("intro_answer").default(""),
});
