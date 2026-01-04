import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useSubmitPractice } from "../_hooks/use-submit-practice";

export const PracticeActions = () => {
	const { handleSubmit, isPending } = useSubmitPractice();

	return (
		<>
			<div className="flex items-center gap-2">
				<Button
					variant="default"
					size="sm"
					onClick={handleSubmit}
					className="text-xs sm:text-sm"
				>
					Kết thúc
				</Button>
			</div>
			<LoadingOverlay open={isPending} message="Bạn chờ chút nhé..." />
		</>
	);
};
