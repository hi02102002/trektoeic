import { getRouteApi } from "@tanstack/react-router";
import { useMemo } from "react";
import {
	type ButtonNavigatorStatus,
	Navigator,
} from "@/components/practices/navigator";
import { useAnswers, useCurrentQuestion } from "@/stores/attempt";

const PART_HAVE_MULTIPLE_SUBS = new Set([3, 4, 6, 7]);

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$session-id/results/",
);

export const QuestionsNavigator = () => {
	const gotoQuestion = useCurrentQuestion((s) => s.goto);
	const setSubQuestionIdx = useCurrentQuestion((s) => s.setSubQuestionIdx);
	const { questions } = Route.useLoaderData();
	const { part } = Route.useParams();
	const answers = useAnswers((s) => s.answers);

	const isFlagged = (subQuestionId: string) => {
		const answer = answers[subQuestionId];
		return answer?.isFlagged ?? false;
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
						status: "wrong",
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

	return (
		<Navigator
			mappedQuestions={mappedQuestions}
			groupedQuestions={groupedQuestions}
			onQuestionClick={({ pIdx, idx, questionId }) => {
				gotoQuestion(pIdx);
				setSubQuestionIdx(idx);
				setTimeout(() => {
					const el = document.getElementById(`question-sub-${questionId}`);

					el?.scrollIntoView({ behavior: "smooth", block: "center" });
				}, 100);
			}}
			className="fixed top-16 h-screen overflow-y-auto border-input border-r"
			mode="result"
		/>
	);
};
