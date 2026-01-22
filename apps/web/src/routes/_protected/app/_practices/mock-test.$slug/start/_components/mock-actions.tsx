import { Button } from "@/components/ui/button";

export const MockActions = () => {
	// const { handleSubmit, isPending } = useSubmitPractice();

	return (
		<>
			<div className="flex items-center gap-2">
				<Button
					variant="default"
					size="sm"
					// onClick={handleSubmit}
					className="text-xs sm:text-sm"
				>
					Nộp bài
				</Button>
			</div>
			{/* <LoadingOverlay open={isPending} message="Bạn chờ chút nhé..." /> */}
		</>
	);
};
