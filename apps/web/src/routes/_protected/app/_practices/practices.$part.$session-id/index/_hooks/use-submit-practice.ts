import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useTransition } from "react";
import { orpc } from "@/lib/orpc/orpc";
import { useAnswersApi, useQuestionTimerApi } from "@/stores/attempt";

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$session-id/",
);

export const useSubmitPractice = () => {
	const params = Route.useParams();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const createPartPracticeHistoryMutation = useMutation(
		orpc.partPractices.createPartPracticeHistory.mutationOptions(),
	);

	const questionTimerApi = useQuestionTimerApi();
	const answersApi = useAnswersApi();
	const [isPending, startTransition] = useTransition();

	const handleSubmit = () => {
		const numberOfCorrectQuestions = Object.values(
			answersApi.getState().answers,
		).filter((answer) => answer.isCorrect).length;
		const numberOfWrongQuestions = Object.values(
			answersApi.getState().answers,
		).filter((answer) => !answer.isCorrect && answer.choice !== "").length;
		const numberOfUnansweredQuestions = Object.values(
			answersApi.getState().answers,
		).filter((answer) => answer.choice === "").length;
		const totalQuestions = Object.keys(answersApi.getState().answers).length;
		const avgTimePerQuestion = questionTimerApi.getState().getAverageTime();

		const performancePercentile = Math.round(
			(numberOfCorrectQuestions / totalQuestions) * 100,
		);

		startTransition(async () => {
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
					duration:
						search?.duration ??
						questionTimerApi.getState().getTotalSessionTime(),
					numberOfQuestions: totalQuestions,
					numberOfCorrectQuestions,
					numberOfWrongQuestions,
					numberOfUnansweredQuestions,
					avgTimePerQuestion,
					performancePercentile,
				},
				id: params["session-id"],
			});

			await navigate({
				to: "/app/practices/$part/$session-id/results",
				params: {
					part: params.part,
					"session-id": params["session-id"],
				},
				replace: true,
				ignoreBlocker: true,
			});
		});
	};

	return { handleSubmit, isPending };
};
