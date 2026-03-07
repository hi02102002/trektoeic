import { createFileRoute, Link } from "@tanstack/react-router";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { buttonVariants } from "@/components/ui/button";
import { useTotalQuestionsEachPart } from "@/hooks/queries/use-total-questions-each-part";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { PartSectionCard } from "./_components/part-section-card";
import { PracticeStatsGrid } from "./_components/practice-stats-grid";

export const Route = createFileRoute("/_protected/app/_dashboard/practices/")({
	async loader({ context }) {
		const progresses = await Promise.all(
			PARTS.map((part) =>
				context.queryClient.ensureQueryData(
					context.orpc.partPractices.getCurrentProgressOfPartPractice.queryOptions(
						{
							input: {
								part: Number(part),
							},
						},
					),
				),
			),
		);

		let totalAttempt = 0;
		let totalCorrect = 0;
		let sumCompleted = 0;
		let attemptedParts = 0;

		for (const item of progresses) {
			const attempt = item?.attempt ?? 0;
			const correct = item?.correct ?? 0;
			const completed = item?.completed ?? 0;

			totalAttempt += attempt;
			totalCorrect += correct;
			sumCompleted += completed;

			if (attempt > 0) {
				attemptedParts += 1;
			}
		}

		const avgCompleted =
			progresses.length > 0 ? Math.round(sumCompleted / progresses.length) : 0;

		return {
			practiceStats: {
				totalAttempt,
				totalCorrect,
				avgCompleted,
				attemptedParts,
			},
		};
	},
	component: RouteComponent,
	head: ({ match }) => {
		const { meta, links } = generateMetadata({
			title: "Luyện tập TOEIC",
			description:
				"Luyện tập TOEIC theo từng phần - Listening và Reading. Chọn phần cụ thể để tập trung luyện tập và nâng cao kỹ năng TOEIC của bạn.",
			keywords: [
				"luyện tập TOEIC",
				"TOEIC listening",
				"TOEIC reading",
				"luyện TOEIC part 1-7",
				"bài tập TOEIC",
			],
			...createOpenGraphData(
				"Luyện tập TOEIC | TrekToeic",
				"Luyện tập TOEIC theo từng phần - Listening và Reading. Chọn phần cụ thể để tập trung luyện tập và nâng cao kỹ năng TOEIC của bạn.",
				match.pathname,
			),
			robots: {
				index: false,
				follow: false,
			},
			alternates: {
				canonical: match.pathname,
			},
		});

		return { meta, links };
	},
});

const PARTS = ["1", "2", "3", "4", "5", "6", "7"] as const;

function RouteComponent() {
	const { data: totalQuestionsEachPart } = useTotalQuestionsEachPart();

	return (
		<AppContent
			header={
				<AppHeader
					title="Luyện tập"
					description="Chọn phần cụ thể để tập trung luyện tập. Chúng tôi khuyên bạn nên hoàn thành ít nhất một module Nghe và một module Đọc mỗi ngày để đạt hiệu quả tối ưu."
				/>
			}
		>
			<div className="space-y-6">
				<PracticeStatsGrid />

				<div className="space-y-4">
					<div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
						<div>
							<h2 className="font-semibold text-base text-neutral-900">
								Luyện tập theo từng Part
							</h2>
							<p className="text-neutral-500 text-xs">
								Chọn Part Listening hoặc Reading bạn muốn luyện hôm nay.
							</p>
						</div>
						<Link
							to="/app/practices/history"
							className={cn(
								buttonVariants({ variant: "outline", size: "sm" }),
								"text-xs",
							)}
						>
							Xem lịch sử luyện tập
						</Link>
					</div>

					<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
						{PARTS.map((part) => (
							<Link
								key={part}
								to="/app/practices/part-{$part}"
								params={{
									part: +part,
								}}
								className="block"
							>
								<PartSectionCard
									part={part}
									totalQuestions={totalQuestionsEachPart?.[part] ?? undefined}
								/>
							</Link>
						))}
					</div>
				</div>
			</div>
		</AppContent>
	);
}
