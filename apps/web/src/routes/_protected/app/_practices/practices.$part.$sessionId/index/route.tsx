import { createFileRoute, defer } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import { Header } from "@/components/practices/header";
import { generateMetadata } from "@/lib/meta";
import {
	AnswersProvider,
	CurrentQuestionProvider,
	QuestionTimerProvider,
} from "@/stores/attempt";
import { prefetchQuestionMedia } from "@/utils/prefetch-media";
import { ExitPracticeDialog } from "./_components/exit-practice-dialog";
import { PracticeActions } from "./_components/practice-actions";
import { PracticeQuestionsList } from "./_components/practice-questions-list";
import { PracticeTimer } from "./_components/practice-timer";
import { PracticeActionBar } from "./_components/pratice-action-bar";
import { QuestionsNavigator } from "./_components/questions-navigator";

export const Route = createFileRoute(
	"/_protected/app/_practices/practices/$part/$sessionId/",
)({
	validateSearch: z.object({
		duration: z.coerce.number().optional(),
		mode: z.enum(["normal", "timed"]).optional().default("normal"),
		numberOfQuestions: z.coerce.number().optional().default(10),
	}),
	loaderDeps(opts) {
		return opts.search;
	},
	async loader({ deps, context, params }) {
		const questions = await context.queryClient.ensureQueryData(
			context.orpc.partPractices.getPartPractice.queryOptions({
				input: {
					part: Number(params.part),
					limit: deps.numberOfQuestions,
					unique: params.sessionId,
				},
			}),
		);

		defer(
			context.queryClient.ensureQueryData({
				queryKey: ["prefetch-questions", params],
				queryFn: () => prefetchQuestionMedia(questions),
			}),
		);

		return { questions };
	},
	head: ({ params, match }) => {
		const { meta, links } = generateMetadata({
			title: `Bài luyện tập Phần ${params.part}`,
			description: `Luyện tập TOEIC Phần ${params.part} với các câu hỏi được chọn lọc kỹ càng. Nâng cao kỹ năng và đạt điểm cao trong kỳ thi TOEIC.`,
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
	const { questions } = Route.useLoaderData();
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
						title={`Part ${part}`}
						timer={<PracticeTimer />}
						action={<PracticeActions />}
						className="fixed top-0 right-0 left-0 z-40"
						onNavigatorToggle={() => setIsNavigatorOpen(true)}
					/>
					<div className="flex flex-col pt-16">
						<QuestionsNavigator
							isOpen={isNavigatorOpen}
							onOpenChange={setIsNavigatorOpen}
						/>
						<div className="xl:ml-64">
							<PracticeQuestionsList />
						</div>
					</div>
					<PracticeActionBar />
					<ExitPracticeDialog />
				</QuestionTimerProvider>
			</AnswersProvider>
		</CurrentQuestionProvider>
	);
}
