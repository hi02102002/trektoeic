import { ActionBar } from "@/components/practices/action-bar";
import { useCurrentQuestion } from "@/stores/attempt";

export const MockActionBar = () => {
	const { canNext, canPrev, next, prev } = useCurrentQuestion((state) => ({
		canNext: state.canNext,
		canPrev: state.canPrev,
		next: state.next,
		prev: state.prev,
		idx: state.idx,
	}));

	return (
		<>
			{/* <LoadingOverlay open={isPending} message="Đang gửi bài..." /> */}
			<ActionBar
				canNext={canNext}
				canPrev={canPrev}
				// next={() => {
				// 	if (canNext()) {
				// 		next();
				// 	} else {
				// 		handleSubmit();
				// 	}
				// }}
				next={() => (canNext() ? next() : {})}
				prev={prev}
			/>
		</>
	);
};
