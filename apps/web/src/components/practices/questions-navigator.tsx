import { groupBy } from "lodash-es";
import type { ReactNode } from "react";
import { useMemo } from "react";
import {
	type ButtonNavigatorStatus,
	Navigator,
} from "@/components/practices/navigator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAnswers, useCurrentQuestion } from "@/stores/attempt";

const PART_HAVE_MULTIPLE_SUBS = new Set([3, 4, 6, 7]);
const SCROLL_DELAY_MS = 100;

type Question = {
	id: string;
	part?: number;
	subs: Array<{
		id: string;
		position: number;
	}>;
};

type QuestionsNavigatorProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	questions: Array<Question>;
	mode?: "practice" | "result";
	groupBy?: "part" | "question";
	part?: string | number;
	extra?: ReactNode;
};

export const QuestionsNavigator = ({
	isOpen,
	onOpenChange,
	questions,
	mode = "practice",
	groupBy: groupByType,
	part,
	extra,
}: QuestionsNavigatorProps) => {
	const gotoQuestion = useCurrentQuestion((s) => s.goto);
	const setSubQuestionIdx = useCurrentQuestion((s) => s.setSubQuestionIdx);
	const currentSubQuestionIdx = useCurrentQuestion((s) => s.subQuestionIdx);
	const currentQuestionIdx = useCurrentQuestion((s) => s.idx);
	const answers = useAnswers((s) => s.answers);

	const getStatus = (
		parentId: string,
		subQuestionId: string,
	): ButtonNavigatorStatus => {
		const parentIndex = questions.findIndex((q) => q.id === parentId);
		const subIndex = questions[parentIndex]?.subs.findIndex(
			(s) => s.id === subQuestionId,
		);

		if (
			currentSubQuestionIdx === subIndex &&
			parentIndex === currentQuestionIdx
		) {
			return "current";
		}

		const answer = answers[subQuestionId];

		if (!answer || answer.choice === "") {
			return "unanswered";
		}

		// For result mode, show correct/wrong
		if (mode === "result") {
			return answer.isCorrect ? "correct" : "wrong";
		}

		// For practice mode, show answered
		return "answered";
	};

	const isFlagged = (subQuestionId: string) => {
		const answer = answers[subQuestionId];
		return answer?.isFlagged ?? false;
	};

	const mappedQuestions: Record<
		string,
		{ status: ButtonNavigatorStatus; flagged: boolean }
	> = (() => {
		const results = {} as Record<
			string,
			{ status: ButtonNavigatorStatus; flagged: boolean }
		>;

		questions.forEach((q) => {
			q.subs.forEach((sub) => {
				results[sub.id] = {
					status: getStatus(q.id, sub.id),
					flagged: isFlagged(sub.id),
				};
			});
		});

		return results;
	})();

	const groupedQuestions = useMemo(() => {
		// Group by part (for mock-test)
		if (groupByType === "part") {
			const grouppedByPart = groupBy(questions, (q) => q.part);
			return Object.entries(grouppedByPart).map(([part, qs]) => {
				const subs = qs.flatMap((q) =>
					q.subs.map((s) => ({
						id: s.id,
						pos: s.position,
						parentId: q.id,
					})),
				);

				return {
					title: `Phần ${part}`,
					questions: subs,
				};
			});
		}

		// Group by question (for practice with parts 3,4,6,7)
		if (PART_HAVE_MULTIPLE_SUBS.has(Number(part))) {
			return questions.map((q, pIdx) => ({
				title: `Ds câu hỏi ${pIdx + 1}`,
				questions: q.subs.map((s, subIdx) => ({
					id: s.id,
					pos: pIdx * q.subs.length + subIdx + 1,
					parentId: q.id,
				})),
			}));
		}

		// Default: flat list
		return [
			{
				title: "Ds câu hỏi",
				questions: questions.flatMap((q, pIdx) =>
					q.subs.map((s, subIdx) => ({
						id: s.id,
						pos: pIdx * q.subs.length + subIdx + 1,
						parentId: q.id,
					})),
				),
			},
		];
	}, [questions, groupByType, part]);

	const handleQuestionClick = ({
		questionId,
		parentId,
	}: {
		pos: number;
		questionId: string;
		parentId: string;
	}) => {
		const pIdx = questions.findIndex((q) => q.id === parentId);
		const question = questions[pIdx];
		const idx = question?.subs.findIndex((s) => s.id === questionId) ?? 0;

		gotoQuestion(pIdx);
		setSubQuestionIdx(idx);
		onOpenChange(false);
		setTimeout(() => {
			const el = document.getElementById(`question-sub-${questionId}`);
			el?.scrollIntoView({ behavior: "smooth", block: "center" });
		}, SCROLL_DELAY_MS);
	};

	return (
		<>
			<Navigator
				mappedQuestions={mappedQuestions}
				groupedQuestions={groupedQuestions}
				onQuestionClick={handleQuestionClick}
				className="fixed top-16 h-[calc(100svh_-_64px)] overflow-y-auto border-input border-r"
				mode={mode}
				extra={extra}
			/>
			<Sheet open={isOpen} onOpenChange={onOpenChange}>
				<SheetContent side="left" className="w-64 p-0 sm:w-64 xl:hidden">
					<Navigator
						mappedQuestions={mappedQuestions}
						groupedQuestions={groupedQuestions}
						onQuestionClick={handleQuestionClick}
						className="flex h-full"
						mode={mode}
						extra={extra}
					/>
				</SheetContent>
			</Sheet>
		</>
	);
};
