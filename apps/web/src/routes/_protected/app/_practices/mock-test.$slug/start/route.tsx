import { createFileRoute, defer, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/practices/header";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import {
	AnswersProvider,
	CurrentQuestionProvider,
	QuestionTimerProvider,
	useCurrentQuestion,
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

		defer(
			context.queryClient.ensureQueryData({
				queryKey: ["prefetch-media", params],
				queryFn: () => prefetchQuestionMedia(result.questions),
			}),
		);

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
			>
				<QuestionTimerProvider>
					<Header
						title={kit.name}
						timer={<MockTimer />}
						action={<MockActions />}
						className="fixed top-0 right-0 left-0 z-40"
						onNavigatorToggle={() => setIsNavigatorOpen(true)}
					/>
					<MockTestStartContent
						isNavigatorOpen={isNavigatorOpen}
						onNavigatorOpenChange={setIsNavigatorOpen}
						questions={questions}
					/>
					<MockActionBar />
					<ExitMockTestDialog />
				</QuestionTimerProvider>
			</AnswersProvider>
		</CurrentQuestionProvider>
	);
}

type MockTestStartLayoutQuestion = {
	part: number;
};

function MockTestStartContent({
	isNavigatorOpen,
	onNavigatorOpenChange,
	questions,
}: {
	isNavigatorOpen: boolean;
	onNavigatorOpenChange: (open: boolean) => void;
	questions: MockTestStartLayoutQuestion[];
}) {
	const currentQuestionIdx = useCurrentQuestion((s) => s.idx);
	const isViewportScrollPart = [6, 7].includes(
		questions[currentQuestionIdx]?.part ?? 0,
	);

	return (
		<div
			className={
				isViewportScrollPart
					? "flex h-svh flex-col overflow-hidden pt-16"
					: "flex flex-col pt-16"
			}
		>
			<QuestionsNavigator
				isOpen={isNavigatorOpen}
				onOpenChange={onNavigatorOpenChange}
			/>
			<div
				className={
					isViewportScrollPart ? "min-h-0 flex-1 xl:ml-64" : "xl:ml-64"
				}
			>
				<MockQuestionsList />
			</div>
		</div>
	);
}
