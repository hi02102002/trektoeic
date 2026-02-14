import {
	createEmptyCard,
	type Card as FsrsCard,
	type Grade as FsrsGrade,
	fsrs,
	generatorParameters,
	Rating,
	type RecordLogItem,
	State,
	type StepUnit,
} from "ts-fsrs";

export type VocabularyReviewState = "new" | "learning" | "review" | "mastered";
export type VocabularyReviewGrade = "again" | "hard" | "good" | "easy";

export type VocabularyReviewCardSchedule = {
	state: VocabularyReviewState;
	repetitions: number;
	lapses: number;
	intervalDays: number;
	easeFactor: number;
	nextReviewAt?: Date;
	lastReviewedAt?: Date | null;
};

export type ReviewComputation = {
	grade: VocabularyReviewGrade;
	before: VocabularyReviewCardSchedule;
	after: VocabularyReviewCardSchedule;
	nextReviewAt: Date;
	nextReviewInMs: number;
	intervalLabel: string;
};

export type SessionStateInput = {
	remainingNewCards: number;
	relearnDueAt: Date[];
	now?: Date;
};

export type SessionStateResult =
	| { status: "show-card" }
	| { status: "waiting"; waitMs: number; nextAvailableAt: Date }
	| { status: "completed" };

type SchedulerConfig = {
	requestRetention: number;
	maximumInterval: number;
	enableFuzz: boolean;
	enableShortTerm: boolean;
	learningSteps: readonly StepUnit[];
	relearningSteps: readonly StepUnit[];
	defaultEaseFactor: number;
	minEaseFactor: number;
	maxEaseFactor: number;
	masteredThresholdDays: number;
};

const DEFAULT_CONFIG: SchedulerConfig = {
	// Target recall probability (0..1). Higher => more frequent reviews.
	requestRetention: 0.9,
	// Hard cap for long-term intervals (in days).
	maximumInterval: 36500,
	// Adds slight interval randomness to avoid same-day card clustering.
	enableFuzz: false,
	// Enables short-term (re)learning step scheduling.
	enableShortTerm: true,
	// Initial learning ladder applied to new cards.
	learningSteps: ["1m", "10m"],
	// Relearning ladder used after forgetting a learned card.
	relearningSteps: ["10m"],
	// App-level "easeFactor" storage bounds (mapped to FSRS difficulty 1..10).
	minEaseFactor: 130,
	defaultEaseFactor: 250,
	maxEaseFactor: 300,
	// Product-level state: intervals at/above this become "mastered".
	masteredThresholdDays: 30,
};

const MINUTE_MS = 60 * 1000;

export class VocabularyReviewScheduler {
	private readonly config: SchedulerConfig;
	private readonly scheduler;

	/**
	 * Creates a scheduler instance with optional config overrides.
	 */
	constructor(config?: Partial<SchedulerConfig>) {
		this.config = { ...DEFAULT_CONFIG, ...config };
		this.scheduler = fsrs(
			generatorParameters({
				request_retention: this.config.requestRetention,
				maximum_interval: this.config.maximumInterval,
				enable_fuzz: this.config.enableFuzz,
				enable_short_term: this.config.enableShortTerm,
				learning_steps: this.config.learningSteps,
				relearning_steps: this.config.relearningSteps,
			}),
		);
	}

	/**
	 * Normalizes a partial card payload into a complete schedule object.
	 * Useful for first-time cards or nullable DB values.
	 */
	public normalizeCard(
		card: Partial<VocabularyReviewCardSchedule>,
	): VocabularyReviewCardSchedule {
		return {
			state: card.state ?? "new",
			repetitions: card.repetitions ?? 0,
			lapses: card.lapses ?? 0,
			intervalDays: card.intervalDays ?? 0,
			easeFactor: card.easeFactor ?? this.config.defaultEaseFactor,
			nextReviewAt: card.nextReviewAt,
			lastReviewedAt: card.lastReviewedAt ?? null,
		};
	}

	/**
	 * Applies one grade to a card and returns before/after snapshots
	 * plus computed next-review metadata for storage and UI.
	 */
	public applyGrade(input: {
		card: VocabularyReviewCardSchedule;
		grade: VocabularyReviewGrade;
		now?: Date;
	}): ReviewComputation {
		const now = input.now ?? new Date();
		const before = this.normalizeCard(input.card);
		const fsrsCard = this.toFsrsCard(before, now);
		const record = this.scheduler.next(
			fsrsCard,
			now,
			this.toFsrsRating(input.grade),
		);
		const nextReviewAt = record.card.due;
		const after = this.fromFsrsCard(record.card, before);
		const nextReviewInMs = Math.max(nextReviewAt.getTime() - now.getTime(), 0);

		return {
			grade: input.grade,
			before,
			after: {
				...after,
				lastReviewedAt: now,
				nextReviewAt,
			},
			nextReviewAt,
			nextReviewInMs,
			intervalLabel: this.formatInterval(nextReviewInMs),
		};
	}

	/**
	 * Returns a full preview for all four grades.
	 * Use this to render interval labels on answer buttons.
	 */
	public preview(card: VocabularyReviewCardSchedule, now?: Date) {
		const reviewAt = now ?? new Date();
		const before = this.normalizeCard(card);
		const preview = this.scheduler.repeat(
			this.toFsrsCard(before, reviewAt),
			reviewAt,
		);

		return {
			again: this.toReviewComputation(
				before,
				"again",
				preview[Rating.Again],
				reviewAt,
			),
			hard: this.toReviewComputation(
				before,
				"hard",
				preview[Rating.Hard],
				reviewAt,
			),
			good: this.toReviewComputation(
				before,
				"good",
				preview[Rating.Good],
				reviewAt,
			),
			easy: this.toReviewComputation(
				before,
				"easy",
				preview[Rating.Easy],
				reviewAt,
			),
		} as const;
	}

	/**
	 * Formats a duration in milliseconds into a compact Anki-style label.
	 * Examples: "<10m", "2d", "4mo".
	 */
	public formatInterval(ms: number): string {
		if (ms < 60 * 1000) {
			return "<1m";
		}

		const minutes = ms / MINUTE_MS;
		if (minutes < 60) {
			return `<${Math.ceil(minutes)}m`;
		}

		const days = minutes / (60 * 24);
		if (days < 30) {
			return `${Number(days.toFixed(1))}d`;
		}

		const months = days / 30;
		return `${Number(months.toFixed(1))}mo`;
	}

	private toReviewComputation(
		before: VocabularyReviewCardSchedule,
		grade: VocabularyReviewGrade,
		record: RecordLogItem,
		now: Date,
	): ReviewComputation {
		const nextReviewAt = record.card.due;
		const nextReviewInMs = Math.max(nextReviewAt.getTime() - now.getTime(), 0);

		return {
			grade,
			before,
			after: this.fromFsrsCard(record.card, before),
			nextReviewAt,
			nextReviewInMs,
			intervalLabel: this.formatInterval(nextReviewInMs),
		};
	}

	private toFsrsCard(card: VocabularyReviewCardSchedule, now: Date): FsrsCard {
		const normalized = this.normalizeCard(card);
		const base = createEmptyCard(normalized.lastReviewedAt ?? now);

		return {
			...base,
			due: normalized.nextReviewAt ?? now,
			last_review: normalized.lastReviewedAt ?? undefined,
			state: this.toFsrsState(normalized.state),
			reps: Math.max(0, normalized.repetitions),
			lapses: Math.max(0, normalized.lapses),
			scheduled_days: Math.max(0, normalized.intervalDays),
			stability: this.toFsrsStability(normalized.intervalDays),
			difficulty: this.toFsrsDifficulty(normalized.easeFactor),
		};
	}

	private fromFsrsCard(
		card: FsrsCard,
		before: VocabularyReviewCardSchedule,
	): VocabularyReviewCardSchedule {
		const intervalDays = Math.max(0, Math.round(card.scheduled_days));

		return {
			state: this.fromFsrsState(card.state, intervalDays, before.state),
			repetitions: Math.max(0, card.reps),
			lapses: Math.max(0, card.lapses),
			intervalDays,
			easeFactor: this.fromFsrsDifficulty(card.difficulty),
			nextReviewAt: card.due,
			lastReviewedAt: card.last_review ?? null,
		};
	}

	private toFsrsRating(grade: VocabularyReviewGrade): FsrsGrade {
		switch (grade) {
			case "again":
				return Rating.Again as FsrsGrade;
			case "hard":
				return Rating.Hard as FsrsGrade;
			case "good":
				return Rating.Good as FsrsGrade;
			case "easy":
				return Rating.Easy as FsrsGrade;
		}
	}

	private toFsrsState(state: VocabularyReviewState): State {
		switch (state) {
			case "new":
				return State.New;
			case "learning":
				return State.Learning;
			case "review":
			case "mastered":
				return State.Review;
		}
	}

	private fromFsrsState(
		state: State,
		intervalDays: number,
		fallback: VocabularyReviewState,
	): VocabularyReviewState {
		switch (state) {
			case State.New:
				return "new";
			case State.Learning:
			case State.Relearning:
				return "learning";
			case State.Review:
				return this.deriveReviewState(intervalDays);
			default:
				return fallback;
		}
	}

	private toFsrsStability(intervalDays: number): number {
		return Math.max(0.1, intervalDays || 0.1);
	}

	private toFsrsDifficulty(easeFactor: number): number {
		const clampedEase = this.clamp(
			easeFactor,
			this.config.minEaseFactor,
			this.config.maxEaseFactor,
		);

		return this.clamp(
			11 - (clampedEase - this.config.minEaseFactor) / 19,
			1,
			10,
		);
	}

	private fromFsrsDifficulty(difficulty: number): number {
		const ease =
			this.config.minEaseFactor + (11 - this.clamp(difficulty, 1, 10)) * 19;

		return Math.round(
			this.clamp(ease, this.config.minEaseFactor, this.config.maxEaseFactor),
		);
	}

	private deriveReviewState(intervalDays: number): VocabularyReviewState {
		if (intervalDays >= this.config.masteredThresholdDays) {
			return "mastered";
		}

		return "review";
	}

	private clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}
}
