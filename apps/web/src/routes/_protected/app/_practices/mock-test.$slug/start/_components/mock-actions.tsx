import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useSubmitMockTest } from "../_hooks/use-submit-mock-test";

export const MockActions = () => {
	const { handleSubmit, isPending } = useSubmitMockTest();

	return (
		<>
			<div className="flex items-center gap-2">
				<Button
					variant="default"
					size="sm"
					onClick={handleSubmit}
					className="text-xs sm:text-sm"
				>
					Nộp bài
				</Button>
			</div>
			<LoadingOverlay open={isPending} message="Bạn chờ chút nhé..." />
		</>
	);
};
