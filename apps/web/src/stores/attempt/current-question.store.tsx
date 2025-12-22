import { createContext, use, useRef } from "react";
import { createStore, useStore } from "zustand";
import { useShallow } from "zustand/shallow";

type CurrentQuestionValue = {
	idx: number;
	subQuestionIdx: number;
};

const defaultSelector = <T,>(s: T) => s;

type CurrentQuestionActions = {
	canNext: () => boolean;
	canPrev: () => boolean;
	goto: (idx: number) => void;
	next: () => void;
	prev: () => void;
	onChange?: (prevIdx: number, nextIdx: number) => void;
	setSubQuestionIdx: (subIdx: number) => void;
};

type CurrentQuestionState = CurrentQuestionValue & CurrentQuestionActions;

const createCurrentQuestionStore = (args: {
	initialIdx: number;
	questions: Array<{
		/**
		 * Question ID
		 */
		id: string;
	}>;
}) => {
	const { initialIdx, questions } = args;

	const total = questions.length;
	const idx0 = Math.max(0, Math.min(initialIdx, total - 1));
	const question0 = questions[idx0];

	return createStore<CurrentQuestionState>((set, get) => ({
		idx: idx0,
		question: question0,
		subQuestionIdx: 0,
		canNext: () => {
			const { idx } = get();

			return idx < total - 1;
		},
		canPrev: () => {
			const { idx } = get();
			return idx > 0;
		},
		goto: (idx: number) => {
			const prev = get();

			if (idx === prev.idx) {
				return;
			}

			const newIdx = Math.max(0, Math.min(idx, total - 1));

			set({ idx: newIdx, subQuestionIdx: newIdx });

			const onChange = get().onChange;
			if (onChange) {
				onChange(prev.idx, newIdx);
			}
		},
		next: () => {
			const { idx, canNext } = get();
			if (canNext()) {
				get().goto(idx + 1);
			}
		},
		prev: () => {
			const { idx, canPrev } = get();
			if (canPrev()) {
				get().goto(idx - 1);
			}
		},
		setSubQuestionIdx(subIdx) {
			set({ subQuestionIdx: subIdx });
		},
	}));
};

const CurrentQuestionContext = createContext<ReturnType<
	typeof createCurrentQuestionStore
> | null>(null);

export const CurrentQuestionProvider = ({
	children,
	value,
}: {
	value: Parameters<typeof createCurrentQuestionStore>[0];
	children: React.ReactNode;
}) => {
	const storeRef = useRef<ReturnType<typeof createCurrentQuestionStore> | null>(
		null,
	);

	if (!storeRef.current) {
		storeRef.current = createCurrentQuestionStore(value);
	}

	return (
		<CurrentQuestionContext.Provider value={storeRef.current}>
			{children}
		</CurrentQuestionContext.Provider>
	);
};

export const useCurrentQuestionApi = () => {
	const api = use(CurrentQuestionContext);
	if (!api)
		throw new Error(
			"useCurrentQuestionApi must be used within CurrentQuestionProvider",
		);
	return api;
};

export const useCurrentQuestion = <T,>(
	selector?: (s: CurrentQuestionState) => T,
) => {
	const api = use(CurrentQuestionContext);
	if (!api) {
		throw new Error(
			"useCurrentQuestion must be used within a CurrentQuestionProvider",
		);
	}

	return useStore(
		api,
		useShallow((selector ?? defaultSelector) as (s: CurrentQuestionState) => T),
	);
};
