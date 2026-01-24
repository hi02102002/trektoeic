import { getRouteApi } from "@tanstack/react-router";
import { Activity, useEffect, useMemo, useRef } from "react";
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
import { cn } from "@/lib/utils";
import { useAnswers, useCurrentQuestion } from "@/stores/attempt";

const Route = getRouteApi(
	"/_protected/app/_practices/mock-test/$slug/$historyId/result-detail",
);

const PART_LAYOUT_HORIZONTAL = new Set([6, 7]);

export const ResultQuestionsList = () => {
	const leftSideRef = useRef<HTMLDivElement>(null);
	const rightSideRef = useRef<HTMLDivElement>(null);
	const { questions } = Route.useLoaderData();

	const { currentQuestionIdx } = useCurrentQuestion((s) => ({
		currentQuestionIdx: s.idx,
	}));

	const answers = useAnswers();

	const currentQuestion = useMemo(
		() => questions[currentQuestionIdx],
		[currentQuestionIdx, questions],
	);

	const isHorizontalLayout = PART_LAYOUT_HORIZONTAL.has(
		currentQuestion?.part ?? 0,
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Need to only run on currentQuestionIdx change>
	useEffect(() => {
		leftSideRef.current?.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		rightSideRef.current?.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, [currentQuestionIdx]);

	return (
		<div
			className={cn("mx-auto h-full max-w-3xl space-y-8 pb-20", {
				"lg:!flex-row flex h-[calc(100svh_-_4rem)] max-w-full flex-col space-y-0":
					isHorizontalLayout,
			})}
		>
			<QuestionProvider question={currentQuestion}>
				<div
					className={cn("space-y-3 p-4 pb-0", {
						"w-full overflow-auto pb-4 lg:max-w-3xl": isHorizontalLayout,
					})}
					ref={leftSideRef}
				>
					<div className="flex items-center justify-between">
						<QuestionPos externalPos={`${currentQuestionIdx + 1}`} />
					</div>
					<QuestionAudio />
					<QuestionImage />
					<QuestionTeaser />
				</div>
				<QuestionSubs
					classNames={{
						wrapper: cn("w-full space-y-8 p-4 pt-0", {
							"overflow-y-auto border-input border-l pt-4": isHorizontalLayout,
						}),
					}}
					ref={rightSideRef}
				>
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
										isAnswerSelected={!!currentAnswer?.choice}
										defaultOpen={true}
									/>
								</Activity>
							</div>
						);
					}}
				</QuestionSubs>
			</QuestionProvider>
		</div>
	);
};
