import { getRouteApi } from "@tanstack/react-router";
import { getTime } from "@trektoeic/utils/get-time";
import { dayjs } from "@/lib/dayjs";

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$session-id/results/",
);

export const ResultTimeStats = () => {
	const { history } = Route.useLoaderData();
	return (
		<div className="bg-white px-4">
			<div className="grid gap-2">
				<div className="rounded-lg border border-neutral-100 bg-neutral-50 p-2">
					<div className="mb-1 text-neutral-500 text-xs">Tổng thời gian</div>
					<div className="font-semibold text-neutral-900 text-sm">
						{dayjs
							.duration(history.metadata.duration ?? 0, "milliseconds")
							.format(
								(history.metadata.duration ?? 0) >=
									getTime({
										hours: 1,
									})
									? "HH:mm:ss"
									: "mm:ss",
							)}
					</div>
				</div>
				<div className="rounded-lg border border-neutral-100 bg-neutral-50 p-2">
					<div className="mb-1 text-neutral-500 text-xs">Trung bình/câu</div>
					<div className="font-semibold text-neutral-900 text-sm">
						{dayjs
							.duration(
								history.metadata.avgTimePerQuestion ?? 0,
								"milliseconds",
							)
							.format(
								(history.metadata.avgTimePerQuestion ?? 0) >=
									getTime({
										hours: 1,
									})
									? "HH:mm:ss"
									: "mm:ss",
							)}
					</div>
				</div>
			</div>
		</div>
	);
};
