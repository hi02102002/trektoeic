import { TrendUpIcon } from "@phosphor-icons/react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { cn } from "@/lib/utils";

const Route = getRouteApi("/_protected/app/_dashboard/vocabularies/");

export function VocabularyInsightsSidebar() {
	const cardStyle = useCardStyle();
	const { stats } = Route.useLoaderData();
	const { masteredWords, learningWords } = stats;
	const dailyGoal = 50;
	const todayProgress = Math.min(masteredWords + learningWords, dailyGoal);
	const dailyProgressPct = Math.round((todayProgress / dailyGoal) * 100);

	return (
		<div className="space-y-4 xl:col-span-4">
			<div className={cn(cardStyle, "h-auto")}>
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
			<div
				className={cn(
					cardStyle,
					"h-auto border-indigo-200 bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-50",
				)}
			>
				<p className="font-semibold text-base">Weekly Report</p>
				<p className="mt-1 text-indigo-200 text-sm">
					Xem báo cáo chi tiết về tiến trình học tập của bạn.
				</p>
				<Link
					to="/app/vocabularies/explore"
					className={cn(
						buttonVariants({ variant: "secondary", size: "sm" }),
						"mt-4 w-full bg-indigo-50 text-indigo-950 hover:bg-indigo-100",
					)}
				>
					<TrendUpIcon className="size-4" />
					Xem báo cáo
				</Link>
			</div>
		</div>
	);
}
