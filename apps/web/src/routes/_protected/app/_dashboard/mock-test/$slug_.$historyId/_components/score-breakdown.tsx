import { getRouteApi, Link } from "@tanstack/react-router";
import { navigatorButtonVariants } from "@/components/practices/navigator";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { cn } from "@/lib/utils";

const Route = getRouteApi(
	"/_protected/app/_dashboard/mock-test/$slug_/$historyId",
);

export const ScoreBreakdown = () => {
	const cardStyle = useCardStyle();
	const params = Route.useParams();

	const {
		result: { history },
	} = Route.useLoaderData();

	const getQuestionStatus = (subQuestionId: string) => {
		const answer = history.contents.find(
			(a) => a.subQuestionId === subQuestionId,
		);

		if (!answer) {
			return "unanswered";
		}

		if (answer.userAnswer.length === 0) {
			return "unanswered";
		}

		if (answer.isCorrect) {
			return "correct";
		}

		return "wrong";
	};

	return (
		<div className={cn(cardStyle)}>
			<h2 className="mb-4 flex items-center gap-2 font-semibold text-primary text-sm uppercase tracking-wider">
				Danh sách câu hỏi
			</h2>
			<div className="grid grid-cols-[repeat(auto-fit,minmax(32px,1fr))] gap-2">
				{history.contents.map((q, index) => {
					return (
						<Link
							to="/app/mock-test/$slug/$historyId/result-detail"
							params={params}
							search={{
								questionId: q.questionId,
								subQuestionId: q.subQuestionId,
							}}
							key={q.subQuestionId}
							className={cn(
								navigatorButtonVariants({
									status: getQuestionStatus(q.subQuestionId),
									isFlagged: q.isFlagged,
								}),
							)}
							type="button"
						>
							{index + 1}
						</Link>
					);
				})}
			</div>
		</div>
	);
};
