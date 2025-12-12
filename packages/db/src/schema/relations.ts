import { relations } from "drizzle-orm";
import { account, session, user } from "./auth";
import { kits } from "./kit";
import { questions, subQuestions } from "./question";
import { vocabularies, vocabularyCategories } from "./vocabulary";

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const questionsRelations = relations(questions, ({ many, one }) => ({
	subQuestions: many(subQuestions),
	kit: one(kits, {
		fields: [questions.kitId],
		references: [kits.id],
	}),
}));

export const subQuestionsRelations = relations(subQuestions, ({ one }) => ({
	question: one(questions, {
		fields: [subQuestions.questionId],
		references: [questions.id],
	}),
}));

export const kitsRelations = relations(questions, ({ many }) => ({
	questions: many(questions),
}));

export const vocabularyCategoriesRelations = relations(
	vocabularyCategories,
	({ one, many }) => ({
		parent: one(vocabularyCategories, {
			fields: [vocabularyCategories.parentId],
			references: [vocabularyCategories.id],
			relationName: "category_parent",
		}),
		children: many(vocabularyCategories, {
			relationName: "category_parent",
		}),
		vocabularies: many(vocabularies),
	}),
);

export const vocabulariesRelations = relations(vocabularies, ({ one }) => ({
	category: one(vocabularyCategories, {
		fields: [vocabularies.categoryId],
		references: [vocabularyCategories.id],
	}),
}));
