import type { AppRouterOutputs } from "@trektoeic/api/routers/index";

export type VocabularyReviewItem =
	AppRouterOutputs["vocabularyReview"]["getDueVocabularies"][number];
