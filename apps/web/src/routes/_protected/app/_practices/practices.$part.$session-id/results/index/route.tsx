import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { Header } from "@/components/practices/header";
import { generateMetadata } from "@/lib/meta";
import { AnswersProvider, CurrentQuestionProvider } from "@/stores/attempt";
import { PracticeTimer } from "./_components/practice-timer";
import { QuestionsNavigator } from "./_components/questions-navigator";
import { ResultActionBar } from "./_components/result-action-bar";
import { ResultQuestionsList } from "./_components/result-questions-list";

export const Route = createFileRoute(
	"/_protected/app/_practices/practices/$part/$session-id/results/",
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
					unique: params["session-id"],
				},
			}),
		);

		return { questions };
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
	const { questions } = Route.useLoaderData();

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
				<Header
					title={`Part ${part}`}
					timer={<PracticeTimer />}
					className="fixed top-0 right-0 left-0"
				/>
				<div className="flex flex-col pt-16">
					<QuestionsNavigator />
					<div className="ml-64">
						<ResultQuestionsList />
					</div>
				</div>
				<ResultActionBar />
			</AnswersProvider>
		</CurrentQuestionProvider>
	);
}
