import {
	ArrowRightIcon,
	BookOpenIcon,
	ChartLineUpIcon,
	ClockIcon,
	ExamIcon,
	FireIcon,
	HeadphonesIcon,
	NotepadIcon,
	ReadCvLogoIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_protected/app/_dashboard/")({
	component: RouteComponent,
});

const stats = [
	{
		title: "Điểm ước tính",
		value: "650",
		change: "+25",
		changeLabel: "so với tuần trước",
		icon: TrendUpIcon,
		color: "text-emerald-600",
		bgColor: "bg-emerald-50",
	},
	{
		title: "Bài đã hoàn thành",
		value: "42",
		change: "+8",
		changeLabel: "tuần này",
		icon: ChartLineUpIcon,
		color: "text-blue-600",
		bgColor: "bg-blue-50",
	},
	{
		title: "Ngày học liên tiếp",
		value: "7",
		change: "🔥",
		changeLabel: "streak",
		icon: FireIcon,
		color: "text-orange-600",
		bgColor: "bg-orange-50",
	},
	{
		title: "Thời gian học",
		value: "12h",
		change: "+2h",
		changeLabel: "tuần này",
		icon: ClockIcon,
		color: "text-violet-600",
		bgColor: "bg-violet-50",
	},
];

const quickActions = [
	{
		title: "Luyện tập",
		description: "Luyện từng Part riêng biệt",
		icon: ReadCvLogoIcon,
		href: "/app/practices",
		color: "text-blue-600",
		bgColor: "bg-blue-50",
	},
	{
		title: "Từ vựng",
		description: "Học từ vựng theo chủ đề",
		icon: NotepadIcon,
		href: "/app/vocabularies",
		color: "text-emerald-600",
		bgColor: "bg-emerald-50",
	},
	{
		title: "Luyện thi",
		description: "Thi thử full test",
		icon: ExamIcon,
		href: "/app/mock-test",
		color: "text-violet-600",
		bgColor: "bg-violet-50",
	},
];

const partProgress = [
	{ part: 1, name: "Photographs", score: 85, type: "Listening" },
	{ part: 2, name: "Question-Response", score: 72, type: "Listening" },
	{ part: 3, name: "Conversations", score: 65, type: "Listening" },
	{ part: 4, name: "Talks", score: 58, type: "Listening" },
	{ part: 5, name: "Incomplete Sentences", score: 78, type: "Reading" },
	{ part: 6, name: "Text Completion", score: 70, type: "Reading" },
	{ part: 7, name: "Reading Comprehension", score: 62, type: "Reading" },
];

const recentActivities = [
	{
		title: "Part 5 - Incomplete Sentences",
		result: "18/20 câu đúng",
		time: "2 giờ trước",
		icon: BookOpenIcon,
	},
	{
		title: "Mock Test #12",
		result: "650 điểm",
		time: "Hôm qua",
		icon: ExamIcon,
	},
	{
		title: "Part 3 - Conversations",
		result: "15/20 câu đúng",
		time: "2 ngày trước",
		icon: HeadphonesIcon,
	},
];

function RouteComponent() {
	const cardStyle = useCardStyle();

	return (
		<AppContent
			header={
				<AppHeader
					title="Trang chủ"
					description="Chào mừng bạn quay lại! Tiếp tục hành trình chinh phục TOEIC của bạn."
				/>
			}
		>
			<div className="space-y-8">
				{/* Stats Grid */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat) => (
						<div key={stat.title} className={cardStyle}>
							<div className="flex items-center justify-between">
								<span className="font-medium text-neutral-500 text-sm">
									{stat.title}
								</span>
								<div className={cn("rounded-lg p-2", stat.bgColor)}>
									<stat.icon
										className={cn("size-4", stat.color)}
										weight="duotone"
									/>
								</div>
							</div>
							<div className="mt-3 flex items-baseline gap-2">
								<span className="font-bold text-2xl text-neutral-900 tracking-tight">
									{stat.value}
								</span>
								<span className={cn("font-medium text-xs", stat.color)}>
									{stat.change}
								</span>
								<span className="text-neutral-400 text-xs">
									{stat.changeLabel}
								</span>
							</div>
						</div>
					))}
				</div>

				{/* Quick Actions */}
				<div>
					<h2 className="mb-4 font-semibold text-lg text-neutral-900">
						Bắt đầu nhanh
					</h2>
					<div className="grid gap-4 sm:grid-cols-3">
						{quickActions.map((action) => (
							<Link key={action.title} to={action.href} className={cardStyle}>
								<div className="flex items-start gap-4">
									<div className={cn("rounded-lg p-2.5", action.bgColor)}>
										<action.icon
											className={cn("size-5", action.color)}
											weight="duotone"
										/>
									</div>
									<div className="flex-1">
										<h3 className="font-semibold text-neutral-900 text-sm group-hover:text-blue-600">
											{action.title}
										</h3>
										<p className="mt-1 text-neutral-500 text-xs">
											{action.description}
										</p>
									</div>
								</div>
								<div className="mt-4 flex items-center justify-end text-neutral-400 text-xs transition-colors group-hover:text-blue-600">
									<span>Bắt đầu</span>
									<ArrowRightIcon className="ml-1 size-3" />
								</div>
							</Link>
						))}
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					{/* Part Progress */}
					<div className={cardStyle}>
						<div className="mb-4">
							<h3 className="font-semibold text-neutral-900">
								Tiến độ theo Part
							</h3>
							<p className="mt-1 text-neutral-500 text-xs">
								Độ thành thạo của bạn ở từng phần
							</p>
						</div>
						<div className="space-y-4">
							{partProgress.map((part) => (
								<div key={part.part} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="font-medium text-neutral-900 text-sm">
												Part {part.part}
											</span>
											<span className="text-neutral-400 text-xs">
												{part.name}
											</span>
										</div>
										<span
											className={cn(
												"font-semibold text-sm",
												part.score >= 80
													? "text-emerald-600"
													: part.score >= 60
														? "text-amber-600"
														: "text-red-600",
											)}
										>
											{part.score}%
										</span>
									</div>
									<Progress
										value={part.score}
										className={cn(
											"h-2",
											part.score >= 80
												? "[&>div]:bg-emerald-500"
												: part.score >= 60
													? "[&>div]:bg-amber-500"
													: "[&>div]:bg-red-500",
										)}
									/>
								</div>
							))}
						</div>
					</div>

					{/* Recent Activity */}
					<div className={cardStyle}>
						<div className="mb-4">
							<h3 className="font-semibold text-neutral-900">
								Hoạt động gần đây
							</h3>
							<p className="mt-1 text-neutral-500 text-xs">
								Các bài luyện tập gần nhất của bạn
							</p>
						</div>
						<div className="space-y-3">
							{recentActivities.map((activity) => (
								<div
									key={activity.title}
									className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-3"
								>
									<div className="rounded-lg border border-neutral-200 bg-white p-2">
										<activity.icon
											className="size-4 text-neutral-500"
											weight="duotone"
										/>
									</div>
									<div className="flex-1">
										<p className="font-medium text-neutral-900 text-sm">
											{activity.title}
										</p>
										<p className="text-neutral-500 text-xs">
											{activity.result}
										</p>
									</div>
									<span className="text-neutral-400 text-xs">
										{activity.time}
									</span>
								</div>
							))}
						</div>
						<Link
							to="/app/practices"
							className={cn(
								buttonVariants({ variant: "outline", size: "sm" }),
								"mt-4 w-full",
							)}
						>
							Xem tất cả hoạt động
						</Link>
					</div>
				</div>
			</div>
		</AppContent>
	);
}
