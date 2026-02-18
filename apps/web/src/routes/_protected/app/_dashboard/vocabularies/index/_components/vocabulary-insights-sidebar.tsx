import { TrendUpIcon } from "@phosphor-icons/react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { cn } from "@/lib/utils";

const Route = getRouteApi("/_protected/app/_dashboard/vocabularies/");

export function VocabularyInsightsSidebar() {
	const cardStyle = useCardStyle();
	const { stats, dueWords } = Route.useLoaderData();
	const { masteredWords, learningWords } = stats;
	const dailyGoal = 50;
	const todayProgress = Math.min(masteredWords + learningWords, dailyGoal);
	const dailyProgressPct = Math.round((todayProgress / dailyGoal) * 100);

	return (
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
					{dueWords.length === 0 ? (
						<p className="text-muted-foreground text-sm">
							No words due right now.
						</p>
					) : (
						dueWords.map((word) => (
							<div
								key={word.id}
								className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2"
							>
								<div className="min-w-0">
									<p className="truncate font-medium text-sm">{word.name}</p>
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
	);
}
