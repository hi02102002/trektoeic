import { createPartPracticeHistory } from "./create-part-practice-history";
import { getCurrentProgressOfPartPractice } from "./get-current-progress-of-part-practice";
import { getPartPracticeHistories } from "./get-part-practice-histories";
import { getPartPracticeHistoryById } from "./get-part-practice-history-by-id";
import { getPartPractices } from "./get-part-practices";
import { redoPartPractices } from "./redo-part-practices";

export const partPracticesQueries = {
	getPartPractices,
	createPartPracticeHistory,
	getPartPracticeHistoryById,
	getCurrentProgressOfPartPractice,
	redoPartPractices,
	getPartPracticeHistories,
};
