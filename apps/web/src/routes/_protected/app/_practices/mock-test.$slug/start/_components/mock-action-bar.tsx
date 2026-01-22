import { ActionBar } from "@/components/practices/action-bar";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useCurrentQuestion } from "@/stores/attempt";
import { useSubmitMockTest } from "../_hooks/use-submit-mock-test";

export const MockActionBar = () => {
	const { canNext, canPrev, next, prev } = useCurrentQuestion((state) => ({
		canNext: state.canNext,
		canPrev: state.canPrev,
		next: state.next,
		prev: state.prev,
		idx: state.idx,
	}));

	const { handleSubmit, isPending } = useSubmitMockTest();

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
