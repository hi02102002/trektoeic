import { getRouteApi } from "@tanstack/react-router";
import { useMount } from "ahooks";
import { QuestionsNavigator as SharedQuestionsNavigator } from "@/components/practices/questions-navigator";
import { useCurrentQuestion } from "@/stores/attempt";
import { ResultMainScore } from "./result-main-score";
import { ResultTimeStats } from "./result-time-stats";

const Route = getRouteApi(
	"/_protected/app/_practices/mock-test/$slug/$historyId/result-detail",
);

export const QuestionsNavigator = ({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { questions } = Route.useLoaderData();
	const { subQuestionId, questionId } = Route.useSearch();

	const gotoQuestion = useCurrentQuestion((s) => s.goto);
	const setSubQuestionIdx = useCurrentQuestion((s) => s.setSubQuestionIdx);

	useMount(() => {
		if (!(subQuestionId && questionId)) {
			return;
		}

		const questionIdx = questions.findIndex((q) => q.id === questionId);
		if (questionIdx === -1) {
			return;
		}

		const subQuestionIdx = questions[questionIdx].subs.findIndex(
			(sq) => sq.id === subQuestionId,
		);

		if (subQuestionIdx === -1) {
			return;
		}

		gotoQuestion(questionIdx);
		setSubQuestionIdx(subQuestionIdx);
		setTimeout(() => {
			const el = document.getElementById(`question-sub-${subQuestionId}`);
			el?.scrollIntoView({ behavior: "smooth", block: "center" });
		}, 300);
	});

	return (
		<SharedQuestionsNavigator
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			questions={questions}
			mode="result"
			groupBy="part"
			extra={
				<>
					<ResultMainScore />
					<ResultTimeStats />
				</>
			}
		/>
	);
};
