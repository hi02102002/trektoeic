import { createContext, use, useRef } from "react";
import { createStore, useStore } from "zustand";
import { useShallow } from "zustand/shallow";

type Answer = {
	choice: string;
	isCorrect: boolean;
	isFlagged?: boolean;
	subQuestionId: string;
	parentQuestionId: string;
};

type AnswersValue = {
	answers: Record<string, Answer>;
};

type AnswersActions = {
	setAnswer: (answer: Answer) => void;
	toggleFlagged: (subQuestionId: string) => void;
};

type AnswersState = AnswersValue & AnswersActions;

const defaultSelector = <T,>(s: T) => s;

const createAnswersStore = (
	questions: { id: string; subs: { id: string }[] }[],
) => {
	const answers = questions.reduce<Record<string, Answer>>((acc, question) => {
		question.subs.forEach((sub) => {
			acc[sub.id] = {
				choice: "",
				isCorrect: false,
				isFlagged: false,
				subQuestionId: sub.id,
				parentQuestionId: question.id,
			};
		});
		return acc;
	}, {});
	return createStore<AnswersState>((set) => ({
		answers,
		setAnswer: (answer: Answer) =>
			set((state) => ({
				answers: {
					...state.answers,
					[answer.subQuestionId]: answer,
				},
			})),
		toggleFlagged: (subQuestionId: string) =>
			set((state) => {
				const existingAnswer = state.answers[subQuestionId];
				if (!existingAnswer) {
					return state;
				}

				return {
					answers: {
						...state.answers,
						[subQuestionId]: {
							...existingAnswer,
							isFlagged: !existingAnswer.isFlagged,
						},
					},
				};
			}),
	}));
};

const AnswersContext = createContext<ReturnType<
	typeof createAnswersStore
> | null>(null);

export const AnswersProvider = ({
	children,
	questions,
}: {
	children: React.ReactNode;
	questions: { id: string; subs: { id: string }[] }[];
}) => {
	const storeRef = useRef<ReturnType<typeof createAnswersStore> | null>(null);

	if (!storeRef.current) {
		storeRef.current = createAnswersStore(questions);
	}

	return (
		<AnswersContext.Provider value={storeRef.current}>
			{children}
		</AnswersContext.Provider>
	);
};

export const useAnswers = <TSelected = AnswersState>(
	select: (state: AnswersState) => TSelected = defaultSelector as (
		state: AnswersState,
	) => TSelected,
): TSelected => {
	const context = use(AnswersContext);
	if (!context) {
		throw new Error("useAnswers must be used within an AnswersProvider");
	}
	return useStore(
		context,
		useShallow(select as (s: AnswersState) => TSelected),
	);
};

export const useAnswersApi = () => {
	const context = use(AnswersContext);
	if (!context) {
		throw new Error("useAnswersApi must be used within an AnswersProvider");
	}
	return context;
};
