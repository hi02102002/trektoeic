import { Flame, Target } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
	return (
		<section className="relative overflow-hidden bg-mesh pt-32 pb-24">
			<div className="container mx-auto grid items-center gap-12 lg:grid-cols-2">
				<motion.div
					className="relative z-10 max-w-xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<motion.div
						className="mb-2 inline-flex cursor-default items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 text-xs shadow-sm transition-colors hover:border-slate-300"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.4, delay: 0.1 }}
					>
						<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
						Cấu trúc đề 2024
					</motion.div>
					<motion.h1
						className="mb-6 font-semibold text-5xl text-slate-900 leading-[1.05] tracking-tight sm:text-6xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						Cách nhanh nhất để đạt điểm cao trong{" "}
						<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							TOEIC®
						</span>
					</motion.h1>
					<motion.p
						className="mb-8 max-w-md text-lg text-slate-500 leading-relaxed"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						Tăng điểm TOEIC của bạn với các bài đánh giá thực tế được cá nhân
						hóa, phân tích chi tiết và lộ trình học tập hiệu quả.
					</motion.p>
					<motion.div
						className="flex flex-col items-center gap-3 sm:flex-row"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						<Button>Bắt đầu miễn phí</Button>
						<Button variant="outline">Tìm hiểu thêm</Button>
					</motion.div>
					<motion.div
						className="mt-10 flex items-center gap-4 font-medium text-slate-500 text-xs"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						<div className="-space-x-3 flex">
							<img
								src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
								alt=""
								className="h-9 w-9 rounded-full border-2 border-white bg-slate-100"
							/>
							<img
								src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
								alt=""
								className="h-9 w-9 rounded-full border-2 border-white bg-slate-100"
							/>
							<img
								src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
								alt=""
								className="h-9 w-9 rounded-full border-2 border-white bg-slate-100"
							/>
							<div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 font-bold text-[10px] text-slate-600">
								+2k
							</div>
						</div>
						<div>
							<div className="mb-0.5 flex items-center gap-0.5 text-yellow-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									role="img"
									width={12}
									height={12}
									viewBox="0 0 24 24"
									data-icon="lucide:star"
									data-width={12}
									style={{ fill: "currentColor" }}
									className="iconify iconify--lucide"
								>
									<path
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									role="img"
									width={12}
									height={12}
									viewBox="0 0 24 24"
									data-icon="lucide:star"
									data-width={12}
									style={{ fill: "currentColor" }}
									className="iconify iconify--lucide"
								>
									<path
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									role="img"
									width={12}
									height={12}
									viewBox="0 0 24 24"
									data-icon="lucide:star"
									data-width={12}
									style={{ fill: "currentColor" }}
									className="iconify iconify--lucide"
								>
									<path
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									role="img"
									width={12}
									height={12}
									viewBox="0 0 24 24"
									data-icon="lucide:star"
									data-width={12}
									style={{ fill: "currentColor" }}
									className="iconify iconify--lucide"
								>
									<path
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									role="img"
									width={12}
									height={12}
									viewBox="0 0 24 24"
									data-icon="lucide:star"
									data-width={12}
									style={{ fill: "currentColor" }}
									className="iconify iconify--lucide"
								>
									<path
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"
									/>
								</svg>
							</div>
							<p>
								Avg. score increase:{" "}
								<span className="font-bold text-slate-900">+150 pts</span>
							</p>
						</div>
					</motion.div>
				</motion.div>
				{/* Hero Visual */}
				<motion.div
					className="relative flex h-[500px] w-full items-center justify-center lg:justify-end"
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					{/* Background Glow */}
					<motion.div
						className="-z-10 absolute inset-0 translate-x-10 transform rounded-full bg-gradient-to-tr from-blue-100/50 to-indigo-50/50 blur-[80px]"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, delay: 0.3 }}
					/>
					{/* Main App Interface Card */}
					<motion.div
						className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-md border border-slate-200/80 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						{/* Fake Browser/App Header */}
						<div className="flex h-12 items-center justify-between border-slate-100 border-b bg-slate-50/50 px-5">
							<div className="flex gap-1.5">
								<div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
								<div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
								<div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
							</div>
							<div className="font-semibold text-[10px] text-slate-400 uppercase tracking-widest">
								Dashboard
							</div>
						</div>
						{/* App Content */}
						<div className="p-6">
							{/* Score Header */}
							<div className="mb-8 flex items-start justify-between">
								<div>
									<h3 className="mb-1 font-medium text-slate-500 text-xs uppercase tracking-wide">
										Điểm hiện tại
									</h3>
									<div className="flex items-baseline gap-2">
										<span className="font-bold text-5xl text-slate-900 tracking-tighter">
											885
										</span>
										<span className="flex items-center gap-1 rounded-full border border-green-100 bg-green-50 px-2 py-0.5 font-medium text-green-600 text-sm">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
												role="img"
												width={12}
												height={12}
												viewBox="0 0 24 24"
												data-icon="lucide:trending-up"
												data-width={12}
												className="iconify iconify--lucide"
											>
												<g
													fill="none"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
												>
													<path d="M16 7h6v6" />
													<path d="m22 7l-8.5 8.5l-5-5L2 17" />
												</g>
											</svg>{" "}
											+45
										</span>
									</div>
								</div>
								<div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
										role="img"
										width={20}
										height={20}
										viewBox="0 0 24 24"
										data-icon="lucide:bar-chart-2"
										data-width={20}
										className="iconify iconify--lucide text-slate-400"
									>
										<path
											fill="none"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 21v-6m7 6V3m7 18V9"
										/>
									</svg>
								</div>
							</div>
							{/* Charts/Bars */}
							<div className="space-y-5">
								<div className="space-y-2">
									<div className="flex justify-between font-medium text-xs">
										<span className="flex items-center gap-1.5 text-slate-700">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
												role="img"
												width={12}
												height={12}
												viewBox="0 0 24 24"
												data-icon="lucide:headphones"
												data-width={12}
												className="iconify iconify--lucide text-blue-500"
											>
												<path
													fill="none"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"
												/>
											</svg>{" "}
											Listening
										</span>
										<span className="text-slate-900">445 / 495</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
										<div
											className="h-full rounded-full bg-blue-600"
											style={{ width: "89%" }}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between font-medium text-xs">
										<span className="flex items-center gap-1.5 text-slate-700">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
												role="img"
												width={12}
												height={12}
												viewBox="0 0 24 24"
												data-icon="lucide:book-open"
												data-width={12}
												className="iconify iconify--lucide text-indigo-500"
											>
												<path
													fill="none"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 7v14m-9-3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4a4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3a3 3 0 0 0-3-3z"
												/>
											</svg>{" "}
											Reading
										</span>
										<span className="text-slate-900">440 / 495</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
										<div
											className="h-full rounded-full bg-slate-800"
											style={{ width: "88%" }}
										/>
									</div>
								</div>
							</div>
							{/* Recent Activity Mini List */}
							<div className="mt-8 border-slate-50 border-t pt-6">
								<div className="mb-3 font-semibold text-[10px] text-slate-400 uppercase tracking-widest">
									Hoạt động gần đây
								</div>
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-md border border-green-100 bg-green-50 text-green-600">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
												role="img"
												width={14}
												height={14}
												viewBox="0 0 24 24"
												data-icon="lucide:check"
												data-width={14}
												className="iconify iconify--lucide"
											>
												<path
													fill="none"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M20 6L9 17l-5-5"
												/>
											</svg>
										</div>
										<div className="flex-1">
											<div className="font-medium text-slate-900 text-xs">
												Part 5: Grammar
											</div>
											<div className="text-[10px] text-slate-500">
												2 phút trước • 95% chính xác
											</div>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-md border border-orange-100 bg-orange-50 text-orange-600">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
												role="img"
												width={14}
												height={14}
												viewBox="0 0 24 24"
												data-icon="lucide:alert-circle"
												data-width={14}
												className="iconify iconify--lucide"
											>
												<g
													fill="none"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
												>
													<circle cx={12} cy={12} r={10} />
													<path d="M12 8v4m0 4h.01" />
												</g>
											</svg>
										</div>
										<div className="flex-1">
											<div className="font-medium text-slate-900 text-xs">
												Part 7: Reading Comp
											</div>
											<div className="text-[10px] text-slate-500">
												1 giờ trước • 70% chính xác
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
					<motion.div
						className="-right-14 glass-panel absolute bottom-20 z-20 hidden rounded-md border border-white/50 bg-white p-3 shadow-lg md:block"
						initial={{ opacity: 0, x: 20, y: 20 }}
						animate={{ opacity: 1, x: 0, y: 0 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-sm">
								<Flame size={20} />
							</div>
							<div>
								<div className="font-semibold text-slate-500 text-xs">
									Day Streak
								</div>
								<div className="glass-panel font-bold text-slate-900 text-sm leading-none">
									14 ngày
								</div>
							</div>
						</div>
					</motion.div>
					<motion.div
						className="-left-6 glass-panel absolute top-36 z-20 hidden rounded-md border border-white/50 bg-white p-3 shadow-lg md:block"
						initial={{ opacity: 0, x: -20, y: 20 }}
						animate={{ opacity: 1, x: 0, y: 0 }}
						transition={{ duration: 0.5, delay: 0.8 }}
					>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-white text-blue-600 shadow-sm">
								<Target size={20} />
							</div>
							<div className="pr-2">
								<div className="font-semibold text-slate-500 text-xs">Goal</div>
								<div className="font-bold text-slate-900 text-sm">
									900+ Club
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};
