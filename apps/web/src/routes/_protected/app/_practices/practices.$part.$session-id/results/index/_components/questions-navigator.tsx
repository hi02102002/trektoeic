import { getRouteApi } from "@tanstack/react-router";
import { QuestionsNavigator as SharedQuestionsNavigator } from "@/components/practices/questions-navigator";
import { ResultMainScore } from "./result-main-score";
import { ResultTimeStats } from "./result-time-stats";

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
	const { questions } = Route.useLoaderData();
	const { part } = Route.useParams();

	return (
		<SharedQuestionsNavigator
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			questions={questions}
			mode="result"
			part={part}
			extra={
				<>
					<ResultMainScore />
					<ResultTimeStats />
				</>
			}
		/>
	);
};
