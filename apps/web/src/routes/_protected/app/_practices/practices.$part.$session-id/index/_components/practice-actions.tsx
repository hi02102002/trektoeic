import { Button } from "@/components/ui/button";
import { useAnswersApi, useQuestionTimerApi } from "@/stores/attempt";

export const PracticeActions = () => {
	const questionTimerApi = useQuestionTimerApi();
	const answersApi = useAnswersApi();

	const handleSubmit = () => {
		console.log(questionTimerApi.getState());
		console.log(answersApi.getState());
	};

	return (
		<div className="flex items-center gap-2">
			<Button variant="default" size="sm" onClick={handleSubmit}>
				Kết thúc
			</Button>
		</div>
	);
};
