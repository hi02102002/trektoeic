import { getRouteApi } from "@tanstack/react-router";
import { Activity, useEffect, useMemo } from "react";
import {
	QuestionAudio,
	QuestionImage,
	QuestionPos,
	QuestionProvider,
	QuestionSubExplanation,
	QuestionSubOptions,
	QuestionSubs,
	QuestionSubText,
	QuestionTeaser,
} from "@/components/question";
import { QuestionSplitLayout } from "@/components/question-split-layout";
import { cn } from "@/lib/utils";
import { useAnswers, useCurrentQuestion } from "@/stores/attempt";

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$sessionId/results/",
);

const PART_LAYOUT_HORIZONTAL = new Set([6, 7]);

export const ResultQuestionsList = () => {
	const { part } = Route.useParams();
	const { questions } = Route.useLoaderData();

	const { currentQuestionIdx } = useCurrentQuestion((s) => ({
		currentQuestionIdx: s.idx,
	}));
	const currentSubQuestionIdx = useCurrentQuestion((s) => s.subQuestionIdx);

	const answers = useAnswers();

	const currentQuestion = useMemo(
		() => questions[currentQuestionIdx],
		[currentQuestionIdx, questions],
	);

	useEffect(() => {
		const subQuestionId = currentQuestion?.subs[currentSubQuestionIdx]?.id;
		if (!subQuestionId) {
			return;
		}

		const rafId = window.requestAnimationFrame(() => {
			document
				.getElementById(`question-sub-${subQuestionId}`)
				?.scrollIntoView({ behavior: "smooth", block: "center" });
		});

		return () => {
			window.cancelAnimationFrame(rafId);
		};
	}, [currentQuestion, currentSubQuestionIdx]);

	const isHorizontalLayout = PART_LAYOUT_HORIZONTAL.has(Number(part));

	return (
		<QuestionProvider question={currentQuestion}>
			<QuestionSplitLayout
				enabled={isHorizontalLayout}
				resetKey={currentQuestionIdx}
				renderTop={() => (
					<>
						<div className="flex items-center justify-between">
							<QuestionPos externalPos={`${currentQuestionIdx + 1}`} />
						</div>
						<QuestionAudio />
						<QuestionImage mode="review" isReadyToReveal={true} />
						<QuestionTeaser mode="review" isReadyToReveal={true} />
					</>
				)}
				renderBottom={() => (
					<QuestionSubs classNames={{ wrapper: cn("w-full") }}>
						{({ subQuestionId }) => {
							const currentAnswer = answers.answers[subQuestionId];
							const value = currentAnswer
								? {
										choice: currentAnswer.choice,
										isCorrect: currentAnswer.isCorrect,
										subQuestionId: currentAnswer.subQuestionId,
										questionId: currentAnswer.parentQuestionId,
									}
								: null;
							return (
								<div className="space-y-3" key={subQuestionId}>
									<QuestionSubText />
									<QuestionSubOptions mode="review" value={value} />
									<Activity mode="visible">
										<QuestionSubExplanation
											mode="review"
											isAnswerSelected={true}
											defaultOpen={true}
										/>
									</Activity>
								</div>
							);
						}}
					</QuestionSubs>
				)}
			/>
		</QuestionProvider>
	);
};
