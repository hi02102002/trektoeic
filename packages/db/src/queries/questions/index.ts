import { getQuestionsByIds } from "./get-questions-by-ids";
import { getQuestionsByKitId } from "./get-questions-by-kit-id";
import { getQuestionsByKitSlug } from "./get-questions-by-kit-slug";
import { getRandomQuestionsByPart } from "./get-random-questions-by-part";
import { getTotalQuestionsEachPart } from "./get-total-questions-each-part";

export const questionsQueries = {
	getTotalQuestionsEachPart,
	getRandomQuestionsByPart,
	getQuestionsByIds,
	getQuestionsByKitId,
	getQuestionsByKitSlug,
};
