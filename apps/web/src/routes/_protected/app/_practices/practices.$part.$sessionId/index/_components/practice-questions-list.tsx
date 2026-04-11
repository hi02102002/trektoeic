import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { getRouteApi } from "@tanstack/react-router";
import { Activity, useEffect, useMemo } from "react";
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
import { QuestionSplitLayout } from "@/components/question-split-layout";
import { cn } from "@/lib/utils";
import {
	useAnswers,
	useCurrentQuestion,
	useQuestionTimer,
} from "@/stores/attempt";

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$sessionId/",
);

const PART_LAYOUT_HORIZONTAL = new Set([6, 7]);

export const PracticeQuestionsList = () => {
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
	const currentSubQuestionIdx = useCurrentQuestion((s) => s.subQuestionIdx);

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
	const isCurrentQuestionFullyAnswered = useMemo(
		() =>
			currentQuestion.subs.every(
				(sub) => (answers.answers[sub.id]?.choice ?? "") !== "",
			),
		[currentQuestion, answers.answers],
	);

	const isHorizontalLayout = PART_LAYOUT_HORIZONTAL.has(Number(part));

	useEffect(() => {
		if (!currentQuestion) return;

		if (!questionTimer.isAnswered(currentQuestion.id)) {
			questionTimer.startQuestion(currentQuestion.id);
		}

		return () => {
			questionTimer.pauseQuestion(currentQuestion.id);
		};
	}, [currentQuestion, questionTimer]);

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

	return (
		<QuestionProvider question={currentQuestion}>
			<QuestionSplitLayout
				enabled={isHorizontalLayout}
				resetKey={currentQuestionIdx}
				renderTop={() => (
					<>
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
						<QuestionAudio
							disableSeek={mode === "timed"}
							disableSpeed={mode === "timed"}
						/>
						<QuestionImage
							mode={mode === "timed" ? "exam" : "practice"}
							isReadyToReveal={isCurrentQuestionFullyAnswered}
						/>
						<QuestionTeaser
							mode={mode === "timed" ? "exam" : "practice"}
							isReadyToReveal={isCurrentQuestionFullyAnswered}
						/>
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

											answers.setAnswer({
												choice: opts.choice,
												isCorrect: opts.isCorrect ?? false,
												subQuestionId: opts.subQuestionId,
												parentQuestionId: opts.questionId,
												part: Number(part),
											});

											const isParentQuestionFullyAnswered =
												currentQuestion.subs.every((sub) => {
													if (sub.id === opts.subQuestionId) {
														return opts.choice !== "";
													}

													return (answers.answers[sub.id]?.choice ?? "") !== "";
												});

											if (isParentQuestionFullyAnswered) {
												questionTimer.markAsAnswered(opts.questionId);
											}
										}}
									/>
									{mode === "normal" && currentAnswer?.choice ? (
										<div
											className={cn(
												"flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm",
												currentAnswer.isCorrect
													? "border-emerald-200 bg-emerald-50/90 text-emerald-950"
													: "border-red-200 bg-red-50/90 text-red-950",
											)}
										>
											{currentAnswer.isCorrect ? (
												<CheckCircleIcon
													className="size-5 shrink-0 text-emerald-600"
													weight="fill"
												/>
											) : (
												<XCircleIcon
													className="size-5 shrink-0 text-red-600"
													weight="fill"
												/>
											)}
											<span className="font-medium">
												{currentAnswer.isCorrect ? "Chính xác!" : "Chưa đúng."}
											</span>
										</div>
									) : null}
									<Activity mode={currentAnswer.choice ? "visible" : "hidden"}>
										<QuestionSubExplanation
											mode={mode === "timed" ? "exam" : "practice"}
											isAnswerSelected={!!currentAnswer.choice}
											answerCorrect={
												mode === "normal" && currentAnswer.choice
													? currentAnswer.isCorrect
													: undefined
											}
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
