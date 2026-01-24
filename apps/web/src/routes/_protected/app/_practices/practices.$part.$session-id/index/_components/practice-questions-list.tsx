import { getRouteApi } from "@tanstack/react-router";
import { Activity, useEffect, useMemo, useRef } from "react";
import {
	QuestionAudio,
	QuestionFlagButton,
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
import {
	useAnswers,
	useCurrentQuestion,
	useQuestionTimer,
} from "@/stores/attempt";

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$session-id/",
);

const PART_LAYOUT_HORIZONTAL = new Set([6, 7]);

export const PracticeQuestionsList = () => {
	const leftSideRef = useRef<HTMLDivElement>(null);
	const rightSideRef = useRef<HTMLDivElement>(null);
	const { part } = Route.useParams();
	const { questions } = Route.useLoaderData();
	const { mode } = Route.useSearch({
		select(state) {
			return {
				mode: state.mode ?? "normal",
			};
		},
	});
	const { currentQuestionIdx } = useCurrentQuestion((s) => ({
		currentQuestionIdx: s.idx,
	}));

	const questionTimer = useQuestionTimer((s) => ({
		startQuestion: s.startQuestion,
		pauseQuestion: s.pauseQuestion,
		isAnswered: s.isAnswered,
		markAsAnswered: s.markAsAnswered,
	}));

	const answers = useAnswers();

	const currentQuestion = useMemo(
		() => questions[currentQuestionIdx],
		[currentQuestionIdx, questions],
	);

	const isHorizontalLayout = PART_LAYOUT_HORIZONTAL.has(Number(part));

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

	useEffect(() => {
		if (!currentQuestion) return;

		if (!questionTimer.isAnswered(currentQuestion.id)) {
			questionTimer.startQuestion(currentQuestion.id);
		}

		return () => {
			questionTimer.pauseQuestion(currentQuestion.id);
		};
	}, [currentQuestion, questionTimer]);

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
						{currentQuestion.subs.length === 1 && (
							<QuestionFlagButton
								isAdded={
									answers.answers[currentQuestion.subs[0].id]?.isFlagged ??
									false
								}
								onToggle={() =>
									answers.toggleFlagged(currentQuestion.subs[0].id)
								}
							/>
						)}
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
								<QuestionSubText
									flag={
										currentQuestion.subs.length > 1 ? (
											<QuestionFlagButton
												isAdded={
													answers.answers[subQuestionId]?.isFlagged ?? false
												}
												onToggle={() => answers.toggleFlagged(subQuestionId)}
											/>
										) : null
									}
								/>
								<QuestionSubOptions
									mode={mode === "timed" ? "exam" : "practice"}
									isDisabledAfterSelect={mode === "normal"}
									value={value}
									onValueChange={(opts) => {
										if (!opts) {
											return;
										}

										const { questionId } = opts;
										questionTimer.markAsAnswered(questionId);

										answers.setAnswer({
											choice: opts.choice,
											isCorrect: opts.isCorrect ?? false,
											subQuestionId: opts.subQuestionId,
											parentQuestionId: questionId,
											part: Number(part),
										});
									}}
								/>
								<Activity mode={currentAnswer.choice ? "visible" : "hidden"}>
									<QuestionSubExplanation
										mode={mode === "timed" ? "exam" : "practice"}
										isAnswerSelected={!!currentAnswer.choice}
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
