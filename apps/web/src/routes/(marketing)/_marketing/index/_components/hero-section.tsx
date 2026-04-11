import {
	BookOpenTextIcon,
	ChartLineUpIcon,
	CheckIcon,
	FlameIcon,
	HeadphonesIcon,
	StarIcon,
	TargetIcon,
	TrendUpIcon,
	WarningCircleIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { IconBadge } from "@/components/icon-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const HeroSection = () => {
	return (
		<section className="relative overflow-hidden bg-landing-surface bg-neutral-50 pt-28 pb-20">
			<div className="container mx-auto grid items-center gap-12 lg:grid-cols-2">
				<motion.div
					className="relative z-10 max-w-xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<motion.div
						className="mb-3 inline-flex cursor-default items-center gap-2 rounded-none border border-border bg-card px-3 py-1 font-medium text-muted-foreground text-xs shadow-none ring-1 ring-foreground/10"
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.4, delay: 0.1 }}
					>
						<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
						Cấu trúc đề cập nhật
					</motion.div>
					<motion.h1
						className="mb-5 font-heading font-semibold text-3xl text-neutral-900 leading-tight tracking-tight sm:text-4xl md:text-5xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.15 }}
					>
						Cách hiệu quả để nâng điểm{" "}
						<span className="text-blue-600">TOEIC</span>
					</motion.h1>
					<motion.p
						className="mb-8 max-w-md text-base text-neutral-600 leading-relaxed sm:text-lg"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.25 }}
					>
						Luyện theo Part, thi thử có phân tích, từ vựng và ngữ pháp — giao
						diện thống nhất với không gian học trong app.
					</motion.p>
					<motion.div
						className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.35 }}
					>
						<Button
							asChild
							className="h-11 min-h-11 px-6 font-semibold text-sm sm:min-w-[10.5rem]"
						>
							<Link to="/login">Bắt đầu miễn phí</Link>
						</Button>
						<Button
							variant="outline"
							asChild
							className="h-11 min-h-11 px-6 font-semibold text-sm sm:min-w-[10.5rem]"
						>
							<Link to="/about-us">Tìm hiểu thêm</Link>
						</Button>
					</motion.div>
					<motion.div
						className="mt-10 flex items-center gap-4 font-medium text-neutral-500 text-xs"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.45 }}
					>
						<div className="flex -space-x-3">
							<img
								src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
								alt=""
								className="h-9 w-9 rounded-none border-2 border-background bg-muted object-cover"
							/>
							<img
								src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
								alt=""
								className="h-9 w-9 rounded-none border-2 border-background bg-muted object-cover"
							/>
							<img
								src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
								alt=""
								className="h-9 w-9 rounded-none border-2 border-background bg-muted object-cover"
							/>
							<div className="flex h-9 w-9 items-center justify-center rounded-none border-2 border-background bg-muted font-bold text-[10px] text-neutral-600">
								+2k
							</div>
						</div>
						<div>
							<div className="mb-0.5 flex items-center gap-0.5 text-amber-500">
								{[1, 2, 3, 4, 5].map((n) => (
									<StarIcon key={n} className="size-3" weight="fill" />
								))}
							</div>
							<p>
								Trung bình tăng{" "}
								<span className="font-semibold text-neutral-900">
									+150 điểm
								</span>
							</p>
						</div>
					</motion.div>
				</motion.div>

				<motion.div
					className="relative flex min-h-[420px] w-full items-center justify-center lg:min-h-[500px] lg:justify-end"
					initial={{ opacity: 0, x: 24 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.55, delay: 0.15 }}
				>
					<div className="pointer-events-none absolute inset-0 -z-10 translate-x-8 bg-gradient-to-tr from-blue-100/40 via-transparent to-violet-100/30 opacity-90 blur-[72px]" />

					<motion.div
						className="relative z-10 w-full max-w-[420px]"
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.45, delay: 0.3 }}
					>
						<Card className="overflow-hidden p-0 shadow-none ring-1 ring-foreground/10">
							<div className="flex h-11 items-center justify-between border-border border-b bg-muted/40 px-4">
								<div className="flex gap-1.5">
									<div className="size-2 rounded-full bg-muted-foreground/25" />
									<div className="size-2 rounded-full bg-muted-foreground/25" />
									<div className="size-2 rounded-full bg-muted-foreground/25" />
								</div>
								<div className="font-heading font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">
									Dashboard
								</div>
							</div>
							<CardContent className="p-5 sm:p-6">
								<div className="mb-6 flex items-start justify-between gap-3">
									<div>
										<p className="mb-1 font-medium text-neutral-500 text-xs uppercase tracking-wide">
											Điểm ước tính
										</p>
										<div className="flex flex-wrap items-baseline gap-2">
											<span className="font-bold text-4xl text-neutral-900 tracking-tight sm:text-5xl">
												885
											</span>
											<span className="inline-flex items-center gap-1 rounded-none border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 text-sm">
												<TrendUpIcon className="size-3" weight="bold" />
												+45
											</span>
										</div>
									</div>
									<IconBadge className="rounded-none">
										<ChartLineUpIcon />
									</IconBadge>
								</div>
								<div className="space-y-4">
									<div className="space-y-2">
										<div className="flex justify-between font-medium text-xs">
											<span className="flex items-center gap-1.5 text-neutral-700">
												<HeadphonesIcon className="size-3.5" />
												Listening
											</span>
											<span className="text-neutral-900">445 / 495</span>
										</div>
										<Progress value={89} className="h-2 [&>div]:bg-blue-600" />
									</div>
									<div className="space-y-2">
										<div className="flex justify-between font-medium text-xs">
											<span className="flex items-center gap-1.5 text-neutral-700">
												<BookOpenTextIcon className="size-3.5" />
												Reading
											</span>
											<span className="text-neutral-900">440 / 495</span>
										</div>
										<Progress
											value={88}
											className="h-2 [&>div]:bg-neutral-800"
										/>
									</div>
								</div>
								<div className="mt-6 border-border border-t pt-5">
									<p className="mb-3 font-heading font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">
										Hoạt động gần đây
									</p>
									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<IconBadge className="size-8 rounded-none" color="green">
												<CheckIcon className="size-3.5" weight="bold" />
											</IconBadge>
											<div className="min-w-0 flex-1">
												<p className="font-medium text-neutral-900 text-xs">
													Part 5: Ngữ pháp
												</p>
												<p className="text-[10px] text-neutral-500">
													2 phút trước · 95% đúng
												</p>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<IconBadge className="size-8 rounded-none" color="orange">
												<WarningCircleIcon className="size-3.5" weight="bold" />
											</IconBadge>
											<div className="min-w-0 flex-1">
												<p className="font-medium text-neutral-900 text-xs">
													Part 7: Đọc hiểu
												</p>
												<p className="text-[10px] text-neutral-500">
													1 giờ trước · 70% đúng
												</p>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						className={cn(
							"absolute z-20 hidden rounded-none border border-border bg-card/95 p-3 shadow-none ring-1 ring-foreground/10 backdrop-blur-sm md:block",
							"-right-4 bottom-16 lg:-right-10",
						)}
						initial={{ opacity: 0, x: 16, y: 16 }}
						animate={{ opacity: 1, x: 0, y: 0 }}
						transition={{ duration: 0.45, delay: 0.5 }}
					>
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-none bg-gradient-to-br from-orange-400 to-red-500 text-white ring-1 ring-foreground/10">
								<FlameIcon className="size-5" weight="fill" />
							</div>
							<div>
								<p className="font-medium text-muted-foreground text-xs">
									Streak
								</p>
								<p className="font-bold font-heading text-neutral-900 text-sm leading-none">
									14 ngày
								</p>
							</div>
						</div>
					</motion.div>

					<motion.div
						className={cn(
							"absolute z-20 hidden rounded-none border border-border bg-card/95 p-3 shadow-none ring-1 ring-foreground/10 backdrop-blur-sm md:block",
							"top-28 -left-2 lg:-left-6",
						)}
						initial={{ opacity: 0, x: -16, y: 16 }}
						animate={{ opacity: 1, x: 0, y: 0 }}
						transition={{ duration: 0.45, delay: 0.65 }}
					>
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-none border border-border bg-card text-blue-600 ring-1 ring-foreground/10">
								<TargetIcon className="size-5" weight="duotone" />
							</div>
							<div className="pr-1">
								<p className="font-medium text-muted-foreground text-xs">
									Mục tiêu
								</p>
								<p className="font-bold font-heading text-neutral-900 text-sm">
									900+
								</p>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};
