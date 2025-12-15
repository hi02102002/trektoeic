/**
 * Question timer utility to track time spent on each question
 */
export class QuestionTimer {
	private questionTimers: Map<string, { startTime: number; elapsed: number }> =
		new Map();
	private currentQuestionId: string | null = null;
	private sessionStartTime: number = Date.now();

	startQuestion(questionId: string): void {
		if (this.currentQuestionId) {
			this.pauseQuestion(this.currentQuestionId);
		}

		const existing = this.questionTimers.get(questionId);
		this.questionTimers.set(questionId, {
			startTime: Date.now(),
			elapsed: existing?.elapsed || 0,
		});
		this.currentQuestionId = questionId;
	}

	pauseQuestion(questionId: string): void {
		const timer = this.questionTimers.get(questionId);
		if (!timer) return;

		const now = Date.now();
		const additionalTime = Math.floor((now - timer.startTime) / 1000);
		this.questionTimers.set(questionId, {
			startTime: timer.startTime,
			elapsed: timer.elapsed + additionalTime,
		});

		if (this.currentQuestionId === questionId) {
			this.currentQuestionId = null;
		}
	}

	getQuestionTime(questionId: string): number {
		const timer = this.questionTimers.get(questionId);
		if (!timer) return 0;

		if (this.currentQuestionId === questionId) {
			const now = Date.now();
			const ongoingTime = Math.floor((now - timer.startTime) / 1000);
			return timer.elapsed + ongoingTime;
		}

		return timer.elapsed;
	}

	getAllQuestionTimes(): Record<string, number> {
		const result: Record<string, number> = {};
		for (const [questionId] of this.questionTimers) {
			result[questionId] = this.getQuestionTime(questionId);
		}
		return result;
	}

	getTotalSessionTime(): number {
		return Math.floor((Date.now() - this.sessionStartTime) / 1000);
	}

	reset(): void {
		this.questionTimers.clear();
		this.currentQuestionId = null;
		this.sessionStartTime = Date.now();
	}

	getAverageTime(): number {
		const times = Object.values(this.getAllQuestionTimes());
		if (times.length === 0) return 0;
		const total = times.reduce((sum, time) => sum + time, 0);
		return Math.floor(total / times.length);
	}
}

export const createQuestionTimer = (): QuestionTimer => {
	return new QuestionTimer();
};
