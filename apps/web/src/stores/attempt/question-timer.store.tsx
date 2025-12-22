import { createContext, use, useRef } from "react";
import { createStore, useStore } from "zustand";
import { useShallow } from "zustand/shallow";
import { QuestionTimer } from "@/utils/question-timer";

type QuestionTimerState = {
	timer: QuestionTimer;
	startQuestion: (questionId: string) => void;
	pauseQuestion: (questionId: string) => void;
	markAsAnswered: (questionId: string) => void;
	getQuestionTime: (questionId: string) => number;
	getAllQuestionTimes: () => Record<string, number>;
	getTotalSessionTime: () => number;
	getAverageTime: () => number;
	isAnswered: (questionId: string) => boolean;
	reset: () => void;
};

const createQuestionTimerStore = () => {
	const timer = new QuestionTimer();

	return createStore<QuestionTimerState>((_set, get) => ({
		timer,
		startQuestion: (questionId: string) => {
			const { timer } = get();
			timer.startQuestion(questionId);
		},
		pauseQuestion: (questionId: string) => {
			const { timer } = get();
			timer.pauseQuestion(questionId);
		},
		markAsAnswered: (questionId: string) => {
			const { timer } = get();
			timer.markAsAnswered(questionId);
		},
		getQuestionTime: (questionId: string) => {
			const { timer } = get();
			return timer.getQuestionTime(questionId);
		},
		getAllQuestionTimes: () => {
			const { timer } = get();
			return timer.getAllQuestionTimes();
		},
		getTotalSessionTime: () => {
			const { timer } = get();
			return timer.getTotalSessionTime();
		},
		getAverageTime: () => {
			const { timer } = get();
			return timer.getAverageTime();
		},
		isAnswered: (questionId: string) => {
			const { timer } = get();
			return timer.isAnswered(questionId);
		},
		reset: () => {
			const { timer } = get();
			timer.reset();
		},
	}));
};

const QuestionTimerContext = createContext<ReturnType<
	typeof createQuestionTimerStore
> | null>(null);

export const QuestionTimerProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const storeRef = useRef<ReturnType<typeof createQuestionTimerStore> | null>(
		null,
	);

	if (!storeRef.current) {
		storeRef.current = createQuestionTimerStore();
	}

	return (
		<QuestionTimerContext.Provider value={storeRef.current}>
			{children}
		</QuestionTimerContext.Provider>
	);
};

export const useQuestionTimerApi = () => {
	const api = use(QuestionTimerContext);
	if (!api)
		throw new Error(
			"useQuestionTimerApi must be used within QuestionTimerProvider",
		);
	return api;
};

const defaultSelector = <T,>(s: T) => s;

export const useQuestionTimer = <T,>(
	selector?: (s: QuestionTimerState) => T,
) => {
	const api = use(QuestionTimerContext);
	if (!api) {
		throw new Error(
			"useQuestionTimer must be used within a QuestionTimerProvider",
		);
	}

	return useStore(
		api,
		useShallow((selector ?? defaultSelector) as (s: QuestionTimerState) => T),
	);
};
