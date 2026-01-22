import { getRouteApi } from "@tanstack/react-router";
import { QuestionsNavigator as SharedQuestionsNavigator } from "@/components/practices/questions-navigator";

const Route = getRouteApi("/_protected/app/_practices/mock-test/$slug/start");

export const QuestionsNavigator = ({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { questions } = Route.useLoaderData();

	return (
		<SharedQuestionsNavigator
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			questions={questions}
			mode="practice"
			groupBy="part"
		/>
	);
};
