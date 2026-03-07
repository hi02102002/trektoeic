import {
	BookOpenIcon,
	ChartBarIcon,
	CheckCircleIcon,
	TargetIcon,
} from "@phosphor-icons/react";
import { getRouteApi } from "@tanstack/react-router";
import { formatNumber } from "@trektoeic/utils/number";
import { useCardStyle } from "@/hooks/styles/use-card-style";

const Route = getRouteApi("/_protected/app/_dashboard/practices/");

export function PracticeStatsGrid() {
	const { practiceStats } = Route.useLoaderData();
	const cardStyle = useCardStyle();

	const totalAttempt = practiceStats.totalAttempt ?? 0;
	const totalCorrect = practiceStats.totalCorrect ?? 0;
	const avgCompleted = practiceStats.avgCompleted ?? 0;
	const attemptedParts = practiceStats.attemptedParts ?? 0;
	const totalParts = 7;

	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<div className={cardStyle}>
				<div className="flex items-center justify-between">
					<p className="font-medium text-muted-foreground text-sm">
						Lần luyện tập
					</p>
					<BookOpenIcon className="size-4 text-emerald-600" />
				</div>
				<p className="mt-2 font-semibold text-3xl">
					{formatNumber(totalAttempt)}
				</p>
				<p className="text-muted-foreground text-xs">
					Tổng số lượt bạn đã luyện tất cả các Part
				</p>
			</div>

			<div className={cardStyle}>
				<div className="flex items-center justify-between">
					<p className="font-medium text-muted-foreground text-sm">
						Câu trả lời đúng
					</p>
					<TargetIcon className="size-4 text-blue-600" />
				</div>
				<p className="mt-2 font-semibold text-3xl">
					{formatNumber(totalCorrect)}
				</p>
				<p className="text-muted-foreground text-xs">
					Tổng số câu bạn đã trả lời đúng
				</p>
			</div>

			<div className={cardStyle}>
				<div className="flex items-center justify-between">
					<p className="font-medium text-muted-foreground text-sm">
						Tiến độ trung bình
					</p>
					<ChartBarIcon className="size-4 text-violet-600" />
				</div>
				<p className="mt-2 font-semibold text-3xl">
					{formatNumber(avgCompleted)}
					<span className="ml-1 text-base">%</span>
				</p>
				<p className="text-muted-foreground text-xs">
					Mức độ hoàn thành trung bình các Part
				</p>
			</div>

			<div className={cardStyle}>
				<div className="flex items-center justify-between">
					<p className="font-medium text-muted-foreground text-sm">
						Part đã luyện
					</p>
					<CheckCircleIcon className="size-4 text-amber-600" />
				</div>
				<p className="mt-2 font-semibold text-3xl">
					{attemptedParts}/{totalParts}
				</p>
				<p className="text-muted-foreground text-xs">
					Số Part bạn đã bắt đầu luyện
				</p>
			</div>
		</div>
	);
}
