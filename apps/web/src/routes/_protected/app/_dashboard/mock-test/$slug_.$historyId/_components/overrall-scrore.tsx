import { getRouteApi, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { dayjs } from "@/lib/dayjs";
import { cn } from "@/lib/utils";

const Route = getRouteApi(
	"/_protected/app/_dashboard/mock-test/$slug_/$historyId",
);

export const OverallScore = () => {
	const cardStyle = useCardStyle();
	const { slug, historyId } = Route.useParams();
	const {
		result: { history },
	} = Route.useLoaderData();

	return (
		<div className={cn(cardStyle)}>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="flex items-center gap-2 font-semibold text-primary text-sm uppercase tracking-wider">
					Overall Score
				</h2>
				<div className="flex items-center gap-2">
					<Badge variant="secondary">
						Ngày làm bài: {dayjs(history.createdAt).format("DD/MM/YYYY")}
					</Badge>
					<Button size="sm" asChild>
						<Link
							to="/app/mock-test/$slug/$historyId/result-detail"
							params={{ slug, historyId }}
						>
							Xem chi tiết
						</Link>
					</Button>
				</div>
			</div>

			<div className="flex flex-col items-center gap-8 border-border border-b pb-8 sm:flex-row sm:items-end">
				<div className="text-center sm:text-left">
					<div className="font-semibold text-7xl text-primary leading-none tracking-tighter">
						{history.metadata.totalScore ?? 0}
						<span className="font-normal text-3xl text-muted-foreground">
							/990
						</span>
					</div>
				</div>

				<div className="w-full flex-1 rounded-xl border border-blue-100/50 bg-blue-50/50 p-4">
					<div className="mb-2 flex items-end justify-between">
						<span className="flex items-center gap-1.5 font-medium text-blue-900 text-sm">
							Listening
						</span>
						<span className="font-semibold text-2xl text-blue-700 tracking-tight">
							{history.metadata.listeningScore ?? 0}
							<span className="ml-1 font-normal text-blue-400 text-sm">
								/495
							</span>
						</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
						<div className="h-full rounded-full bg-blue-500" />
					</div>
				</div>

				<div className="w-full flex-1 rounded-xl border border-orange-100/50 bg-orange-50/50 p-4">
					<div className="mb-2 flex items-end justify-between">
						<span className="flex items-center gap-1.5 font-medium text-orange-900 text-sm" />
						<span className="font-semibold text-2xl text-orange-700 tracking-tight">
							{history.metadata.readingScore ?? 0}
							<span className="ml-1 font-normal text-orange-400 text-sm">
								/495
							</span>
						</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-100">
						<div className="h-full rounded-full bg-orange-500" />
					</div>
				</div>
			</div>

			<div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
				<div className="text-center sm:text-left">
					<div className="mb-1 text-muted-foreground text-xs">
						Tổng thời gian làm bài
					</div>
					<div className="flex items-center justify-center gap-1 font-semibold text-lg text-primary sm:justify-start">
						{dayjs
							.duration(history.metadata.totalTime ?? 0, "milliseconds")
							.format("HH:mm:ss")}
					</div>
				</div>
				<div className="text-center sm:text-left">
					<div className="mb-1 text-muted-foreground text-xs">Số câu đúng</div>
					<div className="flex items-center justify-center gap-1 font-semibold text-green-600 text-lg sm:justify-start">
						{history.metadata.numberOfCorrectQuestions}
						<span className="font-normal text-muted-foreground text-sm">
							/200
						</span>
					</div>
				</div>
				<div className="text-center sm:text-left">
					<div className="mb-1 text-muted-foreground text-xs">Số câu sai</div>
					<div className="flex items-center justify-center gap-1 font-semibold text-lg text-red-600 sm:justify-start">
						{history.metadata.numberOfWrongQuestions}
						<span className="font-normal text-muted-foreground text-sm">
							/200
						</span>
					</div>
				</div>
				<div className="text-center sm:text-left">
					<div className="mb-1 text-muted-foreground text-xs">
						Số câu bỏ trống
					</div>
					<div className="flex items-center justify-center gap-1 font-semibold text-lg text-muted-foreground sm:justify-start">
						{history.metadata.numberOfUnansweredQuestions}
						<span className="font-normal text-muted-foreground text-sm">
							/200
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
