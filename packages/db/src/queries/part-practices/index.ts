import { createPartPracticeHistory } from "./create-part-practice-history";
import { getCurrentProgressOfPartPractice } from "./get-current-progress-of-part-practice";
import { getPartPracticeHistoryById } from "./get-part-practice-history-by-id";
import { getPartPractices } from "./get-part-practices";
import { redoPartPractices } from "./redo-part-practices";

export const partPracticesQueries = {
	getPartPractices,
	createPartPracticeHistory,
	getPartPracticeHistoryById,
	getCurrentProgressOfPartPractice,
	redoPartPractices,
};
