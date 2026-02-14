import { relations } from "drizzle-orm";
import { account, session, user } from "./auth";
import { history } from "./history";
import { kits } from "./kit";
import { questions, questionsToTags, subQuestions, tags } from "./question";
import { vocabularies, vocabularyCategories } from "./vocabulary";
import { vocabularyReviewCards } from "./vocabulary-review";

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	histories: many(history),
	vocabularyReviewCards: many(vocabularyReviewCards),
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

export const tagsRelations = relations(tags, ({ many }) => ({
	questions: many(questionsToTags),
}));

export const subQuestionsRelations = relations(
	subQuestions,
	({ one, many }) => ({
		question: one(questions, {
			fields: [subQuestions.questionId],
			references: [questions.id],
		}),
		tags: many(questionsToTags),
	}),
);

export const questionsToTagsRelations = relations(
	questionsToTags,
	({ one }) => ({
		question: one(questions, {
			fields: [questionsToTags.questionId],
			references: [questions.id],
		}),
		tag: one(tags, {
			fields: [questionsToTags.tagId],
			references: [tags.id],
		}),
	}),
);

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

export const vocabulariesRelations = relations(
	vocabularies,
	({ one, many }) => ({
		category: one(vocabularyCategories, {
			fields: [vocabularies.categoryId],
			references: [vocabularyCategories.id],
		}),
		reviewCards: many(vocabularyReviewCards),
	}),
);

export const vocabularyReviewCardsRelations = relations(
	vocabularyReviewCards,
	({ one }) => ({
		user: one(user, {
			fields: [vocabularyReviewCards.userId],
			references: [user.id],
		}),
		vocabulary: one(vocabularies, {
			fields: [vocabularyReviewCards.vocabularyId],
			references: [vocabularies.id],
		}),
	}),
);

export const historyRelations = relations(history, ({ one }) => ({
	user: one(user, {
		fields: [history.userId],
		references: [user.id],
	}),
}));
