/**
 * Standard TOEIC duration per part (in milliseconds)
 * Based on official TOEIC test timing
 */
export const TOEIC_PART_DURATION_MS = {
	1: 3 * 60 * 1000, // 3 minutes
	2: 6 * 60 * 1000, // 6 minutes
	3: 11 * 60 * 1000, // 11 minutes
	4: 10 * 60 * 1000, // 10 minutes
	5: 10 * 60 * 1000, // 10 minutes
	6: 8 * 60 * 1000, // 8 minutes
	7: 54 * 60 * 1000, // 54 minutes
} as const;

/**
 * Total TOEIC section durations (milliseconds)
 */
export const TOEIC_SECTION_DURATION_MS = {
	listening: 45 * 60 * 1000,
	reading: 75 * 60 * 1000,
	total: 120 * 60 * 1000,
} as const;

/**
 * Number of questions per part in standard TOEIC test
 */
export const TOEIC_QUESTIONS_PER_PART = {
	1: 6,
	2: 25,
	3: 39,
	4: 30,
	5: 30,
	6: 16,
	7: 54,
} as const;

/**
 * Calculate recommended time per question for each part (milliseconds)
 */
export const getTimePerQuestionMs = (part: number): number => {
	const duration =
		TOEIC_PART_DURATION_MS[part as keyof typeof TOEIC_PART_DURATION_MS];
	const questions =
		TOEIC_QUESTIONS_PER_PART[part as keyof typeof TOEIC_QUESTIONS_PER_PART];

	return Math.round(duration / questions);
};

/**
 * Calculate total recommended time for a given number of questions in a part (ms)
 */
export const calculatePartDurationMs = (
	part: number,
	questionCount: number,
): number => {
	const timePerQuestion = getTimePerQuestionMs(part);
	return timePerQuestion * questionCount;
};

/**
 * Calculate estimated duration with buffer (ms)
 */
export const calculateEstimatedDurationMs = ({
	part,
	questionCount,
	buffer = 0.09,
}: {
	part: number;
	questionCount: number;
	buffer?: number;
}): number => {
	return Math.ceil(calculatePartDurationMs(part, questionCount) * (1 + buffer));
};

/**
 * Time per question by part (ms)
 */
export const TIME_PER_QUESTION_BY_PART_MS = {
	1: getTimePerQuestionMs(1), // ~30_000 ms
	2: getTimePerQuestionMs(2), // ~14_000 ms
	3: getTimePerQuestionMs(3), // ~17_000 ms
	4: getTimePerQuestionMs(4), // ~20_000 ms
	5: getTimePerQuestionMs(5), // ~20_000 ms
	6: getTimePerQuestionMs(6), // ~30_000 ms
	7: getTimePerQuestionMs(7), // ~60_000 ms
} as const;
