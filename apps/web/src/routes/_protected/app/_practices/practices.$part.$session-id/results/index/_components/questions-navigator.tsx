import { getRouteApi } from "@tanstack/react-router";
import { useMemo } from "react";
import {
	type ButtonNavigatorStatus,
	Navigator,
} from "@/components/practices/navigator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAnswers, useCurrentQuestion } from "@/stores/attempt";
import { ResultMainScore } from "./result-main-score";
import { ResultTimeStats } from "./result-time-stats";

const PART_HAVE_MULTIPLE_SUBS = new Set([3, 4, 6, 7]);
const SCROLL_DELAY_MS = 100;

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$session-id/results/",
);

export const QuestionsNavigator = ({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const gotoQuestion = useCurrentQuestion((s) => s.goto);
	const setSubQuestionIdx = useCurrentQuestion((s) => s.setSubQuestionIdx);
	const { questions } = Route.useLoaderData();
	const { part } = Route.useParams();
	const answers = useAnswers((s) => s.answers);

	const isFlagged = (subQuestionId: string) => {
		const answer = answers[subQuestionId];
		return answer?.isFlagged ?? false;
	};

	const getStatus = (subQuestionId: string): ButtonNavigatorStatus => {
		const answer = answers[subQuestionId];

		if (!answer || answer.choice === "") {
			return "unanswered";
		}

		if (answer.isCorrect) {
			return "correct";
		}

		return "wrong";
	};

	const mappedQuestions: Record<string, { status: ButtonNavigatorStatus }> =
		(() => {
			const results = {} as Record<
				string,
				{ status: ButtonNavigatorStatus; flagged: boolean }
			>;

			questions.forEach((q) => {
				q.subs.forEach((sub) => {
					results[sub.id] = {
						status: getStatus(sub.id),
						flagged: isFlagged(sub.id),
					};
				});
			});

			return results;
		})();

	const groupedQuestions = useMemo(() => {
		if (PART_HAVE_MULTIPLE_SUBS.has(Number(part))) {
			return questions.map((q, pIdx) => ({
				title: `Ds câu hỏi ${pIdx + 1}`,
				questions: q.subs.map((s, subIdx) => ({
					id: s.id,
					idx: subIdx,
					pIdx,
					parentId: q.id,
				})),
			}));
		}

		return [
			{
				title: "Ds câu hỏi",
				questions: questions.flatMap((q, pIdx) =>
					q.subs.map((s, subIdx) => ({
						id: s.id,
						idx: pIdx + subIdx,
						pIdx,
						parentId: q.id,
					})),
				),
			},
		];
	}, [part, questions]);

	const handleQuestionClick = ({
		pIdx,
		idx,
		questionId,
	}: {
		pIdx: number;
		idx: number;
		questionId: string;
	}) => {
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
				className="fixed top-16 h-screen overflow-y-auto border-input border-r"
				mode="result"
				extra={
					<>
						<ResultMainScore />
						<ResultTimeStats />
					</>
				}
			/>
			<Sheet open={isOpen} onOpenChange={onOpenChange}>
				<SheetContent side="left" className="w-64 p-0 sm:w-64 xl:hidden">
					<Navigator
						mappedQuestions={mappedQuestions}
						groupedQuestions={groupedQuestions}
						onQuestionClick={handleQuestionClick}
						className="flex h-full"
						mode="result"
						extra={
							<>
								<ResultMainScore />
								<ResultTimeStats />
							</>
						}
					/>
				</SheetContent>
			</Sheet>
		</>
	);
};
