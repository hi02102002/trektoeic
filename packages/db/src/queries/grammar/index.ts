import { getGrammarTopicBySlug } from "./get-grammar-topic-by-slug";
import { listGrammarTopicSummaries } from "./list-grammar-topic-summaries";
import { setGrammarTopicStudied } from "./set-grammar-topic-studied";

export const grammarQueries = {
	listGrammarTopicSummaries,
	getGrammarTopicBySlug,
	setGrammarTopicStudied,
};
