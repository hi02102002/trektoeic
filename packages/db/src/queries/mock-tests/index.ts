export { createMockTestHistory } from "./create-mock-test-history";
export { getMockTestHistories } from "./get-mock-test-histories";
export { getMockTestHistoryById } from "./get-mock-test-history-by-id";

import { createMockTestHistory } from "./create-mock-test-history";
import { getMockTestHistories } from "./get-mock-test-histories";
import { getMockTestHistoryById } from "./get-mock-test-history-by-id";

export const mockTestsQueries = {
	createMockTestHistory,
	getMockTestHistories,
	getMockTestHistoryById,
};
