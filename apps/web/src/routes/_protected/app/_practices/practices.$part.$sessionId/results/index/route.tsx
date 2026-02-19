import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/practices/header";
import { generateMetadata } from "@/lib/meta";
import {
	type Answer,
	AnswersProvider,
	CurrentQuestionProvider,
} from "@/stores/attempt";
import { QuestionsNavigator } from "./_components/questions-navigator";
import { ResultActionBar } from "./_components/result-action-bar";
import { ResultQuestionsList } from "./_components/result-questions-list";

export const Route = createFileRoute(
	"/_protected/app/_practices/practices/$part/$sessionId/results/",
)({
	async loader({ context, params }) {
		const res = await context.queryClient.ensureQueryData(
			context.orpc.partPractices.getPartPracticeHistoryById.queryOptions({
				input: {
					id: params["sessionId"],
				},
			}),
		);

		if (!res) {
			throw notFound();
		}

		return res;
	},
	head: ({ params, match }) => {
		const { meta, links } = generateMetadata({
			title: `Kết quả luyện tập Phần ${params.part}`,
			description: `Xem kết quả luyện tập TOEIC Phần ${params.part} của bạn với phân tích chi tiết và phản hồi để cải thiện kỹ năng.`,
			robots: {
				index: false,
				follow: false,
			},
			alternates: {
				canonical: match.pathname,
			},
		});

		return { meta, links };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { part } = Route.useParams();
	const { questions, history } = Route.useLoaderData();
	const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

	return (
		<CurrentQuestionProvider
			value={{
				initialIdx: 0,
				questions: questions.map((q) => ({
					id: q.id,
				})),
			}}
		>
			<AnswersProvider
				questions={questions.map((q) => {
					return {
						id: q.id,
						part: q.part,
						subs: q.subs.map((sub) => {
							return { id: sub.id };
						}),
					};
				})}
				initialAnswers={history.contents.reduce(
					(acc, content) => {
						acc[content.subQuestionId] = {
							choice: content.userAnswer,
							isCorrect: content.isCorrect,
							isFlagged: content.isFlagged,
							subQuestionId: content.subQuestionId,
							parentQuestionId: content.questionId,
							part: content.part ?? 0,
						};
						return acc;
					},
					{} as Record<string, Answer>,
				)}
			>
				<Header
					title={`Part ${part}`}
					className="fixed top-0 right-0 left-0 z-40"
					onNavigatorToggle={() => setIsNavigatorOpen(true)}
				/>
				<div className="flex flex-col pt-16">
					<QuestionsNavigator
						isOpen={isNavigatorOpen}
						onOpenChange={setIsNavigatorOpen}
					/>
					<div className="xl:ml-64">
						<ResultQuestionsList />
					</div>
				</div>
				<ResultActionBar />
			</AnswersProvider>
		</CurrentQuestionProvider>
	);
}
