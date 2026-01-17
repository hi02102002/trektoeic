export const CACHED_KEYS = {
	partPracticeQuestions: (part: number, limit?: number, unique?: string) => {
		return `part-practice:part:${part}:limit:${limit || "all"}:unique:${unique ?? ""}`;
	},
} as const;
