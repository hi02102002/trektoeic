import type { AppRouterOutputs } from "@trektoeic/api/routers/index";

export type VocabularyStats = AppRouterOutputs["vocabularyReview"]["getStats"];
export type DueWordItem =
	AppRouterOutputs["vocabularyReview"]["getDueVocabularies"][number];
