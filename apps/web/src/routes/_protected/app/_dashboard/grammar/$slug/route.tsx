import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { GrammarExercises, GrammarLessonHtml } from "../_components";
import { GrammarRichLine } from "../_components/grammar-rich-line";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/grammar/$slug",
)({
	loader: async ({ context, params }) => {
		const [topic, topics] = await Promise.all([
			context.queryClient.ensureQueryData(
				context.orpc.grammar.getTopicBySlug.queryOptions({
					input: { slug: params.slug },
				}),
			),
			context.queryClient.ensureQueryData(
				context.orpc.grammar.listTopics.queryOptions(),
			),
		]);
		if (!topic) throw notFound();
		const idx = topics.findIndex((t) => t.slug === params.slug);
		const prevRow = idx > 0 ? topics[idx - 1] : undefined;
		const nextRow =
			idx >= 0 && idx < topics.length - 1 ? topics[idx + 1] : undefined;
		const prevTopic = prevRow
			? { slug: prevRow.slug, title: prevRow.title }
			: null;
		const nextTopic = nextRow
			? { slug: nextRow.slug, title: nextRow.title }
			: null;
		return { topic, prevTopic, nextTopic };
	},
	component: RouteComponent,
	head: ({ match, loaderData }) => {
		const title = loaderData?.topic?.title ?? "Chủ đề ngữ pháp";
		const description =
			loaderData?.topic?.description ?? "Lý thuyết và bài tập ngữ pháp TOEIC.";
		const { meta, links } = generateMetadata({
			title: `${title} | Ngữ pháp TOEIC`,
			description,
			keywords: ["ngữ pháp TOEIC", title, "grammar TOEIC"],
			...createOpenGraphData(
				`${title} | TrekToeic`,
				description,
				match.pathname,
			),
			robots: { index: false, follow: false },
			alternates: { canonical: match.pathname },
		});
		return { meta, links };
	},
});

type Neighbor = { slug: string; title: string };

function TopicNeighborsNav({
	prev,
	next,
	className,
}: {
	prev: Neighbor | null;
	next: Neighbor | null;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-wrap gap-2 sm:gap-3", className)}>
			{prev ? (
				<Link
					to="/app/grammar/$slug"
					params={{ slug: prev.slug }}
					className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}
					title={prev.title}
				>
					<CaretLeftIcon className="size-4 shrink-0" weight="bold" />
					<span className="max-w-[min(100%,12rem)] truncate sm:max-w-[14rem]">
						{prev.title}
					</span>
				</Link>
			) : (
				<Button type="button" variant="outline" disabled className="gap-1.5">
					<CaretLeftIcon className="size-4 shrink-0" weight="bold" />
					Trước
				</Button>
			)}
			{next ? (
				<Link
					to="/app/grammar/$slug"
					params={{ slug: next.slug }}
					className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}
					title={next.title}
				>
					<span className="max-w-[min(100%,12rem)] truncate sm:max-w-[14rem]">
						{next.title}
					</span>
					<CaretRightIcon className="size-4 shrink-0" weight="bold" />
				</Link>
			) : (
				<Button type="button" variant="outline" disabled className="gap-1.5">
					Sau
					<CaretRightIcon className="size-4 shrink-0" weight="bold" />
				</Button>
			)}
		</div>
	);
}

function RouteComponent() {
	const { topic, prevTopic, nextTopic } = Route.useLoaderData();

	return (
		<AppContent
			header={
				<AppHeader
					title={topic.title}
					description={topic.description}
					className="max-w-2xl"
				/>
			}
		>
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<Link
					to="/app/grammar"
					className={cn(
						buttonVariants({ variant: "ghost", size: "sm" }),
						"w-fit px-0",
					)}
				>
					← Tất cả chủ đề
				</Link>
				<TopicNeighborsNav prev={prevTopic} next={nextTopic} />
			</div>

			<div className="space-y-10">
				{(topic.lessonHtml ||
					(topic.sections && topic.sections.length > 0)) && (
					<div className="space-y-8">
						<h2 className="font-semibold text-base text-neutral-900">
							Lý thuyết
						</h2>
						{topic.lessonHtml ? (
							<GrammarLessonHtml html={topic.lessonHtml} />
						) : null}
						{topic.sections.map((section) => (
							<section key={section.heading} className="space-y-3">
								<h3 className="font-medium text-neutral-800 text-sm">
									{section.heading}
								</h3>
								<div className="space-y-3 text-neutral-600 text-sm leading-relaxed">
									{section.body.map((para) => (
										<p key={para.slice(0, 48)}>
											<GrammarRichLine text={para} />
										</p>
									))}
								</div>
							</section>
						))}
					</div>
				)}

				{topic.exercises.length > 0 ? <Separator /> : null}

				<GrammarExercises
					exercises={topic.exercises}
					exerciseTypeName={topic.exerciseTypeName}
					exerciseTypeDes={topic.exerciseTypeDes}
				/>

				<div className="border-neutral-200 border-t pt-6">
					<TopicNeighborsNav
						prev={prevTopic}
						next={nextTopic}
						className="w-full justify-between"
					/>
				</div>
			</div>
		</AppContent>
	);
}
