import {
	BookOpenIcon,
	ChartBarIcon,
	ClockIcon,
	LightningIcon,
	TargetIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/vocabularies/",
)({
	loader: async ({ context }) => {
		const [categories, stats, dueWords] = await Promise.all([
			context.queryClient.ensureQueryData(
				context.orpc.vocabularies.getAllCategories.queryOptions({
					input: {
						level: 1,
					},
				}),
			),
			context.queryClient.ensureQueryData(
				context.orpc.vocabularyReview.getStats.queryOptions({
					input: {},
				}),
			),
			context.queryClient.ensureQueryData(
				context.orpc.vocabularyReview.getDueVocabularies.queryOptions({
					input: {
						limit: 5,
					},
				}),
			),
		]);

		return { categories, stats, dueWords };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = Route.useRouteContext();
	const { categories, stats, dueWords } = Route.useLoaderData();
	const cardStyle = useCardStyle();
	const dueWordItems = dueWords as Array<{
		id: string;
		name: string;
		type: string;
		state: string;
	}>;

	const topCategories = [...categories]
		.sort((a, b) => (b.totalWords ?? 0) - (a.totalWords ?? 0))
		.slice(0, 4);

	const masteredPct =
		stats.totalWords > 0
			? Number(((stats.masteredWords / stats.totalWords) * 100).toFixed(1))
			: 0;

	const learningPct =
		stats.totalWords > 0
			? Number(((stats.learningWords / stats.totalWords) * 100).toFixed(1))
			: 0;

	const dailyGoal = 50;
	const todayProgress = Math.min(
		stats.masteredWords + stats.learningWords,
		dailyGoal,
	);
	const dailyProgressPct = Math.round((todayProgress / dailyGoal) * 100);

	return (
		<AppContent
			header={
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<AppHeader
						title="Từ vựng"
						description={
							<>
								Hellooo, <span className="font-semibold">{user.user.name}</span>
								! Hôm nay bạn có{" "}
								<span className="font-semibold">{dueWordItems.length}</span> từ
								cần ôn tập. Let's keep up the great work! 🚀
							</>
						}
						className="max-w-3xl"
					/>
					<div className="flex items-center gap-2">
						<Link
							to="/app/vocabularies/review"
							className={cn(buttonVariants({ size: "sm" }))}
						>
							<LightningIcon className="size-4" />
							Quick Review
						</Link>
					</div>
				</div>
			}
		>
			<div className="space-y-6">
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<div className={cardStyle}>
						<div className="flex items-center justify-between">
							<p className="font-medium text-muted-foreground text-sm">
								Tất cả từ vựng
							</p>
							<BookOpenIcon className="size-4 text-emerald-600" />
						</div>
						<p className="mt-2 font-semibold text-3xl">{stats.totalWords}</p>
						<p className="text-muted-foreground text-xs">
							Tổng số từ bạn đang học
						</p>
					</div>

					<div className={cardStyle}>
						<div className="flex items-center justify-between">
							<p className="font-medium text-muted-foreground text-sm">
								Mastered
							</p>
							<TargetIcon className="size-4 text-indigo-600" />
						</div>
						<p className="mt-2 font-semibold text-3xl">{stats.masteredWords}</p>
						<p className="text-muted-foreground text-xs">{masteredPct}% trên</p>
					</div>

					<div className={cardStyle}>
						<div className="flex items-center justify-between">
							<p className="font-medium text-muted-foreground text-sm">
								Learning
							</p>
							<ChartBarIcon className="size-4 text-amber-600" />
						</div>
						<p className="mt-2 font-semibold text-3xl">{stats.learningWords}</p>
						<p className="text-muted-foreground text-xs">
							{learningPct}% đang học
						</p>
					</div>

					<div className={cardStyle}>
						<div className="flex items-center justify-between">
							<p className="font-medium text-muted-foreground text-sm">
								Từ mới
							</p>
							<ClockIcon className="size-4 text-violet-600" />
						</div>
						<p className="mt-2 font-semibold text-3xl">{stats.newWords}</p>
						<p className="text-muted-foreground text-xs">Số từ cần học</p>
					</div>
				</div>

				<div className="grid gap-6 xl:grid-cols-12">
					<div className="space-y-4 xl:col-span-8">
						<div className="flex items-center justify-between">
							<h2 className="font-semibold text-lg">Bộ sưu tập</h2>
							<Link
								to="/app/vocabularies/explore"
								className="text-muted-foreground text-sm hover:text-primary"
							>
								Explore
							</Link>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							{topCategories.map((category) => {
								const progress = category.progressPct ?? 0;
								const label = `${category.learnedWords ?? 0} / ${category.totalWords ?? 0} words`;
								const isExplore = Boolean(category.hasChild);
								return (
									<Link
										key={category.id}
										to={
											isExplore
												? "/app/vocabularies/explore"
												: "/app/vocabularies/explore/$slug"
										}
										search={
											isExplore
												? { parentId: category.id, level: category.level + 1 }
												: undefined
										}
										params={!isExplore ? { slug: category.slug } : undefined}
										className={cn(cardStyle)}
									>
										<div className="flex items-start justify-between gap-3">
											<div>
												<p className="font-semibold text-base">
													{category.name}
												</p>
												<p className="mt-1 text-muted-foreground text-sm">
													{label}
												</p>
											</div>
											<span className="rounded-md bg-neutral-100 px-2 py-1 font-medium text-xs">
												{category.dueWords ?? 0} due
											</span>
										</div>
										<div className="mt-4 space-y-2">
											<div className="flex items-center justify-between text-xs">
												<span className="text-muted-foreground">Progress</span>
												<span className="font-semibold">{progress}%</span>
											</div>
											<Progress
												value={progress}
												className={cn("h-2", "[&>div]:bg-emerald-500")}
											/>
										</div>
									</Link>
								);
							})}

							<Link
								to="/app/vocabularies/explore"
								className={cn(
									cardStyle,
									"items-center justify-center border-dashed text-center",
								)}
							>
								<div className="space-y-2">
									<div className="mx-auto flex size-9 items-center justify-center rounded-full border border-neutral-300">
										<span className="font-semibold text-lg">+</span>
									</div>
									<p className="font-semibold text-sm">Explore New Deck</p>
									<p className="text-muted-foreground text-xs">
										Browse more vocabulary topics
									</p>
								</div>
							</Link>
						</div>
					</div>

					<div className="space-y-4 xl:col-span-4">
						<div className={cardStyle}>
							<div className="mb-3 flex items-center justify-between">
								<h3 className="font-semibold text-sm">Daily Goal</h3>
								<span className="text-muted-foreground text-xs">Today</span>
							</div>
							<div className="flex items-center gap-4">
								<div className="flex size-16 items-center justify-center rounded-full border-4 border-neutral-200 font-semibold text-sm">
									{dailyProgressPct}%
								</div>
								<div>
									<p className="font-semibold text-base">
										{todayProgress} / {dailyGoal} words
									</p>
									<p className="text-muted-foreground text-sm">
										Keep it up! You are almost there.
									</p>
								</div>
							</div>
						</div>

						<div className={cardStyle}>
							<div className="mb-3 flex items-center justify-between">
								<h3 className="font-semibold text-sm">Due Words</h3>
								<Link
									to="/app/vocabularies/review"
									className="text-muted-foreground text-xs hover:text-primary"
								>
									Study
								</Link>
							</div>
							<div className="space-y-3">
								{dueWordItems.length === 0 ? (
									<p className="text-muted-foreground text-sm">
										No words due right now.
									</p>
								) : (
									dueWordItems.map((word) => (
										<div
											key={word.id}
											className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2"
										>
											<div className="min-w-0">
												<p className="truncate font-medium text-sm">
													{word.name}
												</p>
												<p className="truncate text-muted-foreground text-xs">
													{word.type}
												</p>
											</div>
											<span className="rounded-md bg-white px-2 py-1 text-[11px] uppercase tracking-wide">
												{word.state}
											</span>
										</div>
									))
								)}
							</div>
						</div>

						<div
							className={cn(
								cardStyle,
								"border-indigo-200 bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-50",
							)}
						>
							<p className="font-semibold text-base">Weekly Report</p>
							<p className="mt-1 text-indigo-200 text-sm">
								View your vocabulary learning progress.
							</p>
							<Link
								to="/app/vocabularies/explore"
								className={cn(
									buttonVariants({ variant: "secondary", size: "sm" }),
									"mt-4 w-full bg-indigo-50 text-indigo-950 hover:bg-indigo-100",
								)}
							>
								<TrendUpIcon className="size-4" />
								View Analytics
							</Link>
						</div>
					</div>
				</div>
			</div>
		</AppContent>
	);
}
