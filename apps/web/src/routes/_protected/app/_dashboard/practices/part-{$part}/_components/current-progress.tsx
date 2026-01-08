import {
	ChartPieIcon,
	CheckCircleIcon,
	TargetIcon,
} from "@phosphor-icons/react";
import { getRouteApi } from "@tanstack/react-router";

const Route = getRouteApi("/_protected/app/_dashboard/practices/part-{$part}");

export const CurrentProgress = () => {
	const { currentProgress } = Route.useLoaderData();
	return (
		<div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
			<div className="border-neutral-100 border-b bg-neutral-50/50 px-4 py-3">
				<h3 className="font-semibold text-neutral-900 text-xs">
					Tiến độ hiện tại
				</h3>
			</div>
			<div className="p-4">
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<CheckCircleIcon
								className="text-neutral-400"
								size={16}
								weight="duotone"
							/>
							<span className="font-medium text-neutral-600 text-xs">
								Attempted
							</span>
						</div>
						<span className="font-semibold text-neutral-900 text-sm">
							{currentProgress.attempt || 0}
						</span>
					</div>
					<div className="w-full border-neutral-100 border-t" />
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<TargetIcon
								className="text-teal-500"
								size={16}
								weight="duotone"
							/>
							<span className="font-medium text-neutral-600 text-xs">
								Correct
							</span>
						</div>
						<span className="font-semibold text-sm text-teal-600">
							{currentProgress.correct || 0}
						</span>
					</div>
					<div className="w-full border-neutral-100 border-t" />
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<ChartPieIcon
								className="text-blue-600"
								size={16}
								weight="duotone"
							/>
							<span className="font-medium text-neutral-600 text-xs">
								Completion
							</span>
						</div>
						<span className="font-semibold text-blue-600 text-sm">
							{currentProgress.completed || 0}%
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
