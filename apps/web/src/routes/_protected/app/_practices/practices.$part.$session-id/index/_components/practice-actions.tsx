import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useAnswersApi, useQuestionTimerApi } from "@/stores/attempt";
import { orpc } from "@/utils/orpc";

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$session-id/",
);

export const PracticeActions = () => {
	const params = Route.useParams();
	const search = Route.useSearch();
	const createPartPracticeHistoryMutation = useMutation(
		orpc.partPractices.createPartPracticeHistory.mutationOptions(),
	);

	const questionTimerApi = useQuestionTimerApi();
	const answersApi = useAnswersApi();

	const handleSubmit = async () => {
		const answers = answersApi.getState().answers;
		await createPartPracticeHistoryMutation.mutateAsync({
			contents: Object.values(answers).map((answer) => {
				return {
					isCorrect: answer.isCorrect,
					questionId: answer.parentQuestionId,
					subQuestionId: answer.subQuestionId,
					userAnswer: answer.choice,
					isFlagged: answer.isFlagged,
					timeTaken: questionTimerApi
						.getState()
						.getQuestionTime(answer.parentQuestionId),
				};
			}),
			metadata: {
				part: Number(params.part),
				mode: search.mode,
				duration: questionTimerApi.getState().getTotalSessionTime(),
				numberOfQuestions: Object.keys(answers).length,
			},
		});
	};

	return (
		<>
			<div className="flex items-center gap-2">
				<Button variant="default" size="sm" onClick={handleSubmit}>
					Kết thúc
				</Button>
			</div>
			<LoadingOverlay
				open={createPartPracticeHistoryMutation.isPending}
				message="Đang xử lý..."
			/>
		</>
	);
};
