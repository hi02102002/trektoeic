/**
 * schema for both vocabularies and vocabulary categories, categories review
 * to handle cyclic dependency between them, we put shared schema in this file, and import it in both vocabularies-schema and vocabulary-review-schema
 */

import z from "zod";

export const VocabularyReviewStateSchema = z.enum([
	"new",
	"learning",
	"review",
	"mastered",
]);

export const VocabularyReviewGradeSchema = z.enum([
	"again",
	"hard",
	"good",
	"easy",
]);
