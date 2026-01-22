import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMount } from "ahooks";
import { useState } from "react";
import { Header } from "@/components/practices/header";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import {
	AnswersProvider,
	CurrentQuestionProvider,
	QuestionTimerProvider,
} from "@/stores/attempt";
import { prefetchQuestionMedia } from "@/utils/prefetch-media";
import { ExitMockTestDialog } from "./_components/exit-practice-dialog";
import { MockActionBar } from "./_components/mock-action-bar";
import { MockActions } from "./_components/mock-actions";
import { MockQuestionsList } from "./_components/mock-questions-list";
import { MockTimer } from "./_components/mock-timer";
import { QuestionsNavigator } from "./_components/questions-navigator";

export const Route = createFileRoute(
	"/_protected/app/_practices/mock-test/$slug/start",
)({
	component: RouteComponent,
	async loader({ context, params }) {
		const result = await context.queryClient.ensureQueryData(
			context.orpc.kits.getQuestionsBySlug.queryOptions({
				input: { slug: params.slug },
			}),
		);

		if (!result) {
			throw notFound();
		}

		return result;
	},
	head: ({ loaderData }) => {
		const kit = loaderData?.kit;

		const { meta, links } = generateMetadata({
			title: kit?.name ?? "Đề thi TOEIC",
			description: `Làm đề thi thử ${kit?.name ?? "TOEIC"} theo format chuẩn với thời gian thực tế. 200 câu hỏi, 120 phút làm bài.`,
			keywords: [
				"thi thử TOEIC",
				"đề thi thử TOEIC",
				kit?.name ?? "",
				"mock test TOEIC",
				"full test TOEIC",
			].filter(Boolean),
			...createOpenGraphData(
				`${kit?.name ?? "Đề thi TOEIC"} | TrekToeic`,
				`Làm đề thi thử ${kit?.name ?? "TOEIC"} theo format chuẩn với thời gian thực tế.`,
				`/app/mock-test/${kit?.slug ?? ""}/start`,
			),
			robots: {
				index: false,
				follow: false,
			},
		});

		return { meta, links };
	},
});

function RouteComponent() {
	const { questions, kit } = Route.useLoaderData();
	const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

	useMount(() => {
		prefetchQuestionMedia(questions);
	});

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
						subs: q.subs.map((sub) => {
							return { id: sub.id };
						}),
					};
				})}
			>
				<QuestionTimerProvider>
					<Header
						title={kit.name}
						timer={<MockTimer />}
						action={<MockActions />}
						className="fixed top-0 right-0 left-0 z-40"
						onNavigatorToggle={() => setIsNavigatorOpen(true)}
					/>
					<div className="flex flex-col pt-16">
						<QuestionsNavigator
							isOpen={isNavigatorOpen}
							onOpenChange={setIsNavigatorOpen}
						/>
						<div className="xl:ml-64">
							<MockQuestionsList />
						</div>
					</div>
					<MockActionBar />
					<ExitMockTestDialog />
				</QuestionTimerProvider>
			</AnswersProvider>
		</CurrentQuestionProvider>
	);
}
