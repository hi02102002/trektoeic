import { ActionBar } from "@/components/practices/action-bar";
import { useCurrentQuestion } from "@/stores/attempt";

export const PracticeActionBar = () => {
	const { canNext, canPrev, next, prev } = useCurrentQuestion((state) => ({
		canNext: state.canNext,
		canPrev: state.canPrev,
		next: state.next,
		prev: state.prev,
		idx: state.idx,
	}));

	return (
		<ActionBar canNext={canNext} canPrev={canPrev} next={next} prev={prev} />
	);
};
