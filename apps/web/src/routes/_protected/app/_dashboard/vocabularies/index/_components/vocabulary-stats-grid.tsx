import {
	BookOpenIcon,
	ChartBarIcon,
	ClockIcon,
	TargetIcon,
} from "@phosphor-icons/react";
import { getRouteApi } from "@tanstack/react-router";
import { useCardStyle } from "@/hooks/styles/use-card-style";

const Route = getRouteApi("/_protected/app/_dashboard/vocabularies/");

export function VocabularyStatsGrid() {
	const { stats } = Route.useLoaderData();
	const cardStyle = useCardStyle();

	const masteredPct =
		stats.totalWords > 0
			? Number(((stats.masteredWords / stats.totalWords) * 100).toFixed(1))
			: 0;

	const learningPct =
		stats.totalWords > 0
			? Number(((stats.learningWords / stats.totalWords) * 100).toFixed(1))
			: 0;

	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<div className={cardStyle}>
				<div className="flex items-center justify-between">
					<p className="font-medium text-muted-foreground text-sm">
						Tất cả từ vựng
					</p>
					<BookOpenIcon className="size-4 text-emerald-600" />
				</div>
				<p className="mt-2 font-semibold text-3xl">{stats.totalWords}</p>
				<p className="text-muted-foreground text-xs">Tổng số từ bạn đang học</p>
			</div>

			<div className={cardStyle}>
				<div className="flex items-center justify-between">
					<p className="font-medium text-muted-foreground text-sm">Mastered</p>
					<TargetIcon className="size-4 text-indigo-600" />
				</div>
				<p className="mt-2 font-semibold text-3xl">{stats.masteredWords}</p>
				<p className="text-muted-foreground text-xs">{masteredPct}% trên</p>
			</div>

			<div className={cardStyle}>
				<div className="flex items-center justify-between">
					<p className="font-medium text-muted-foreground text-sm">Learning</p>
					<ChartBarIcon className="size-4 text-amber-600" />
				</div>
				<p className="mt-2 font-semibold text-3xl">{stats.learningWords}</p>
				<p className="text-muted-foreground text-xs">{learningPct}% đang học</p>
			</div>

			<div className={cardStyle}>
				<div className="flex items-center justify-between">
					<p className="font-medium text-muted-foreground text-sm">Từ mới</p>
					<ClockIcon className="size-4 text-violet-600" />
				</div>
				<p className="mt-2 font-semibold text-3xl">{stats.newWords}</p>
				<p className="text-muted-foreground text-xs">Số từ cần học</p>
			</div>
		</div>
	);
}
