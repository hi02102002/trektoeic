import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import { Header } from "@/components/practices/header";
import { generateMetadata } from "@/lib/meta";
import {
	type Answer,
	AnswersProvider,
	CurrentQuestionProvider,
} from "@/stores/attempt";
import { QuestionsNavigator } from "./_components/questions-navigator";
import { ResultActionBar } from "./_components/result-action-bar";
import { ResultActions } from "./_components/result-actions";
import { ResultQuestionsList } from "./_components/result-questions-list";

export const Route = createFileRoute(
	"/_protected/app/_practices/mock-test/$slug/$historyId/result-detail",
)({
	validateSearch: z.object({
		subQuestionId: z.string().optional(),
		questionId: z.string().optional(),
	}),
	async loader({ context, params }) {
		const res = await context.queryClient.ensureQueryData(
			context.orpc.mockTest.getMockTestByHistoryId.queryOptions({
				input: {
					historyId: params.historyId,
				},
			}),
		);

		if (!res) {
			throw notFound();
		}

		return res;
	},
	head: ({ loaderData }) => {
		const title = loaderData?.history?.metadata?.title || "Đề thi";
		const { meta, links } = generateMetadata({
			title: `Kết quả ${title} - Chi tiết`,
			description: `Xem chi tiết kết quả bài thi ${title} với phân tích từng câu hỏi và đáp án.`,
			robots: {
				index: false,
				follow: false,
			},
		});

		return { meta, links };
	},
	component: RouteComponent,
});

function RouteComponent() {
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
							part:
								questions.find((q) => q.id === content.questionId)?.part ?? 0,
						};
						return acc;
					},
					{} as Record<string, Answer>,
				)}
			>
				<Header
					title={history.metadata.title}
					className="fixed top-0 right-0 left-0 z-40"
					onNavigatorToggle={() => setIsNavigatorOpen(true)}
					action={<ResultActions />}
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
