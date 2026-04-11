import { Briefcase, ChartLine, Ear, Timer } from "@phosphor-icons/react";
import { IconBadge } from "@/components/icon-badge";
import { Card, CardContent } from "@/components/ui/card";

export const FeaturesBentoGrid = () => {
	return (
		<section
			id="parts"
			className="border-border border-t bg-neutral-50 py-20 md:py-24"
		>
			<div className="container mx-auto max-w-6xl">
				<div className="mb-12 max-w-2xl md:mb-16">
					<h2 className="mb-3 font-heading font-semibold text-2xl text-neutral-900 tracking-tight md:text-3xl">
						Nắm vững từng phần bài thi TOEIC
					</h2>
					<p className="text-base text-neutral-600 leading-relaxed md:text-lg">
						Cùng hệ thống thẻ, lưới và chữ như trong app — dễ đọc, dễ quét.
					</p>
				</div>
				<div className="grid gap-4 md:grid-cols-3 md:gap-5">
					<Card className="group shadow-none ring-1 ring-foreground/10 transition-shadow hover:shadow-sm md:col-span-2">
						<CardContent className="relative overflow-hidden p-6 md:p-8">
							<div className="relative z-10">
								<IconBadge className="mb-4 rounded-none">
									<Ear size={20} weight="duotone" />
								</IconBadge>
								<h3 className="mb-2 font-heading font-semibold text-lg text-neutral-900 md:text-xl">
									Luyện nghe chuyên sâu
								</h3>
								<p className="max-w-md text-neutral-600 text-sm leading-relaxed md:text-base">
									Bài nghe đa dạng, giao diện làm bài quen thuộc — Part 1–4.
								</p>
							</div>
							<div className="absolute right-0 bottom-0 flex h-28 w-56 items-end gap-1 p-6 opacity-25 transition-opacity group-hover:opacity-45 md:h-32 md:w-64">
								{[40, 70, 50, 90, 30, 60, 80, 45, 20, 75, 50].map((h, i) => (
									<div
										key={i}
										className="w-2 rounded-none bg-blue-600"
										style={{ height: `${h}%` }}
									/>
								))}
							</div>
						</CardContent>
					</Card>
					<Card className="shadow-none ring-1 ring-foreground/10 transition-shadow hover:shadow-sm">
						<CardContent className="p-6 md:p-8">
							<IconBadge className="mb-4 rounded-none" color="amber">
								<Timer size={20} weight="duotone" />
							</IconBadge>
							<h3 className="mb-2 font-heading font-semibold text-lg text-neutral-900 md:text-xl">
								Chiến thuật thời gian
							</h3>
							<p className="text-neutral-600 text-sm leading-relaxed md:text-base">
								Luyện theo giờ, theo số câu — giống không gian luyện tập trong
								app.
							</p>
						</CardContent>
					</Card>
					<Card className="shadow-none ring-1 ring-foreground/10 transition-shadow hover:shadow-sm">
						<CardContent className="p-6 md:p-8">
							<IconBadge className="mb-4 rounded-none" color="emerald">
								<Briefcase size={20} weight="duotone" />
							</IconBadge>
							<h3 className="mb-2 font-heading font-semibold text-lg text-neutral-900 md:text-xl">
								Từ vựng theo chủ đề
							</h3>
							<p className="text-neutral-600 text-sm leading-relaxed md:text-base">
								Thuật ngữ văn phòng, kinh doanh — ôn và ôn lại có lịch.
							</p>
						</CardContent>
					</Card>
					<Card className="shadow-none ring-1 ring-foreground/10 transition-shadow hover:shadow-sm md:col-span-2">
						<CardContent className="flex flex-col gap-8 p-6 md:flex-row md:items-center md:justify-between md:p-8">
							<div className="min-w-0 flex-1">
								<IconBadge className="mb-4 rounded-none" color="purple">
									<ChartLine size={20} weight="duotone" />
								</IconBadge>
								<h3 className="mb-2 font-heading font-semibold text-lg text-neutral-900 md:text-xl">
									Theo dõi tiến độ & mục tiêu
								</h3>
								<p className="text-neutral-600 text-sm leading-relaxed md:text-base">
									Bảng điều khiển thống kê, tiến độ Part và hoạt động gần đây.
								</p>
							</div>
							<div className="flex shrink-0 items-center gap-4 md:pr-4">
								<div className="text-center">
									<div className="mb-1 font-medium text-neutral-400 text-xs uppercase">
										Hiện tại
									</div>
									<div className="font-bold text-2xl text-neutral-400">650</div>
								</div>
								<div className="relative h-px w-20 bg-gradient-to-r from-border to-emerald-500 md:w-24">
									<div className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-500" />
								</div>
								<div className="text-center">
									<div className="mb-1 font-semibold text-emerald-700 text-xs uppercase">
										Mục tiêu
									</div>
									<div className="font-bold text-2xl text-neutral-900 md:text-3xl">
										850+
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};
