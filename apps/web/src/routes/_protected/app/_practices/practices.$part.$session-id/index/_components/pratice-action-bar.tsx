import { ActionBar } from "@/components/practices/action-bar";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useCurrentQuestion } from "@/stores/attempt";
import { useSubmitPractice } from "../_hooks/use-submit-practice";

export const PracticeActionBar = () => {
	const { canNext, canPrev, next, prev } = useCurrentQuestion((state) => ({
		canNext: state.canNext,
		canPrev: state.canPrev,
		next: state.next,
		prev: state.prev,
		idx: state.idx,
	}));

	const { handleSubmit, isPending } = useSubmitPractice();

	return (
		<>
			<LoadingOverlay open={isPending} message="Đang gửi bài..." />
			<ActionBar
				canNext={canNext}
				canPrev={canPrev}
				next={() => {
					if (canNext()) {
						next();
					} else {
						handleSubmit();
					}
				}}
				prev={prev}
			/>
		</>
	);
};
