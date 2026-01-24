import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { calcToeicScore } from "@trektoeic/utils/calc-toeic-score";
import { useTransition } from "react";
import { DURATION_OF_MOCK_TEST_IN_MINUTES, LISTENING_PARTS } from "@/constants";
import { orpc } from "@/lib/orpc/orpc";
import { useAnswersApi, useQuestionTimerApi } from "@/stores/attempt";

const Route = getRouteApi("/_protected/app/_practices/mock-test/$slug/start");

export const useSubmitMockTest = () => {
	const { kit } = Route.useLoaderData();
	const params = Route.useParams();
	const navigate = Route.useNavigate();
	const createMockTestHistoryMutation = useMutation(
		orpc.mockTest.createMockTestHistory.mutationOptions(),
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

		const numberOfCorrectListeningQuestions = Object.values(
			answersApi.getState().answers,
		).filter(
			(answer) => answer.isCorrect && LISTENING_PARTS.has(answer.part),
		).length;

		const numberOfCorrectReadingQuestions =
			numberOfCorrectQuestions - numberOfCorrectListeningQuestions;

		const { listeningScore, readingScore, totalScore } = calcToeicScore({
			listeningCorrect: numberOfCorrectListeningQuestions || 0,
			readingCorrect: numberOfCorrectReadingQuestions || 0,
		});

		startTransition(async () => {
			const answers = answersApi.getState().answers;
			const res = await createMockTestHistoryMutation.mutateAsync({
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
					kitId: kit.id,
					title: kit.name,
					year: kit.year,
					duration: DURATION_OF_MOCK_TEST_IN_MINUTES,
					totalTime: questionTimerApi.getState().getTotalSessionTime(),
					numberOfQuestions: totalQuestions,
					numberOfCorrectQuestions,
					numberOfWrongQuestions,
					numberOfUnansweredQuestions,
					avgTimePerQuestion,
					performancePercentile,
					numberOfCorrectListeningQuestions,
					numberOfCorrectReadingQuestions,
					listeningScore,
					readingScore,
					totalScore,
				},
			});

			await navigate({
				to: "/app/mock-test/$slug/$historyId",
				params: {
					slug: params.slug,
					historyId: res?.id as string,
				},
				replace: true,
				ignoreBlocker: true,
			});
		});
	};

	return { handleSubmit, isPending };
};
