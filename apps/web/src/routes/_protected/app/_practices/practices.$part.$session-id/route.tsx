import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { Header } from "@/components/practices/header";
import {
	type ButtonNavigatorStatus,
	Navigator,
} from "@/components/practices/navigator";
import { Timer } from "@/components/practices/timer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
	"/_protected/app/_practices/practices/$part/$session-id",
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
	component: RouteComponent,
});

function RouteComponent() {
	const { questions } = Route.useLoaderData();
	const { part } = Route.useParams();
	const search = Route.useSearch();

	const flattenedQuestions = questions.flatMap((q) => q.subs);

	return (
		<div className="flex flex-col">
			<Header
				title={`Part ${part}`}
				timer={
					search?.mode === "timed" ? (
						<Timer
							mode="down"
							duration={search.duration ?? 0}
							onDone={() => {
								// will be handle
							}}
							className="-translate-x-1/2 absolute left-1/2 transform"
						/>
					) : (
						<Timer
							mode="up"
							className="-translate-x-1/2 absolute left-1/2 transform"
						/>
					)
				}
				action={
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm">
							Tạm dừng
						</Button>
						<Button variant="default" size="sm">
							Kết thúc
						</Button>
					</div>
				}
			/>
			<div>
				<Navigator
					mappedQuestions={questions.reduce<
						Record<string, { status: ButtonNavigatorStatus }>
					>((acc, question) => {
						acc[question.id] = {
							status:
								Math.random() < 0.5
									? "answered"
									: Math.random() < 0.5
										? "flagged"
										: Math.random() < 0.5
											? "current"
											: "unanswered",
						};
						return acc;
					}, {})}
					groupedQuestions={[
						{
							title: `Part ${part} - Câu hỏi`,
							questions: flattenedQuestions.map((question, index) => ({
								id: question.id,
								number: index + 1,
							})),
						},
					]}
				/>
			</div>
		</div>
	);
}
