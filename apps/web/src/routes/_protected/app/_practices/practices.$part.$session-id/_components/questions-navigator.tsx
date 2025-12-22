import { getRouteApi } from "@tanstack/react-router";
import { useMemo } from "react";
import {
	type ButtonNavigatorStatus,
	Navigator,
} from "@/components/practices/navigator";
import { useAnswers, useCurrentQuestion } from "@/stores/attempt";

const PART_HAVE_MULTIPLE_SUBS = new Set([3, 4, 6, 7]);

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$session-id",
);

export const QuestionsNavigator = () => {
	const gotoQuestion = useCurrentQuestion((s) => s.goto);
	const setSubQuestionIdx = useCurrentQuestion((s) => s.setSubQuestionIdx);
	const currentSubQuestionIdx = useCurrentQuestion((s) => s.subQuestionIdx);
	const currentQuestionIdx = useCurrentQuestion((s) => s.idx);
	const { questions } = Route.useLoaderData();
	const { part } = Route.useParams();
	const answers = useAnswers((s) => s.answers);

	const getStatus = (
		subQuestionId: string,
		subIndex: number,
		parentIndex: number,
	): ButtonNavigatorStatus => {
		console.log(
			currentQuestionIdx,
			parentIndex,
			currentSubQuestionIdx,
			subIndex,
		);

		if (
			currentSubQuestionIdx === subIndex &&
			parentIndex === currentQuestionIdx
		) {
			console.log(
				currentSubQuestionIdx === subIndex &&
					parentIndex === currentQuestionIdx,
			);

			return "current";
		}

		const answer = answers[subQuestionId];

		if (answer.isFlagged) {
			return "flagged";
		}

		if (answer.choice) {
			return "answered";
		}

		return "unanswered";
	};

	const mappedQuestions: Record<string, { status: ButtonNavigatorStatus }> =
		(() => {
			const results = {} as Record<string, { status: ButtonNavigatorStatus }>;

			questions.forEach((q, pIdx) => {
				q.subs.forEach((sub, subIdx) => {
					results[sub.id] = {
						status: getStatus(sub.id, pIdx + subIdx, pIdx),
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
		/>
	);
};
