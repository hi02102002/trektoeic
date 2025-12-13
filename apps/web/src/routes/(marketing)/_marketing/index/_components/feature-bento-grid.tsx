import { Briefcase, ChartLine, Ear, Timer } from "@phosphor-icons/react";
import { IconBadge } from "@/components/icon-badge";

export const FeaturesBentoGrid = () => {
	return (
		<section id="parts" className="bg-slate-50/50 py-24">
			<div className="mx-auto max-w-6xl px-6">
				<div className="mb-16 max-w-2xl">
					<h2 className="mb-4 font-semibold text-3xl text-slate-900 tracking-tight">
						Nắm vừng mọi phần của bài thi TOEIC
					</h2>
					<p className="text-lg text-slate-500">
						Mỗi phần của bài thi TOEIC đều được thiết kế kỹ lưỡng để giúp bạn
						nâng cao kỹ năng một cách toàn diện.
					</p>
				</div>
				<div className="grid gap-6 md:grid-cols-3">
					<div className="group relative overflow-hidden rounded-md border border-slate-200 bg-white p-8 transition-shadow hover:shadow md:col-span-2">
						<div className="relative z-10">
							<IconBadge className="mb-4">
								<Ear size={20} weight="duotone" />
							</IconBadge>
							<h3 className="mb-2 font-semibold text-slate-900 text-xl">
								Luyện Nghe Chuyên Sâu
							</h3>
							<p className="max-w-sm text-slate-500">
								Tận hưởng kho bài tập nghe đa dạng với các đoạn hội thoại thực
								tế và bài tập mô phỏng theo chuẩn TOEIC.
							</p>
						</div>
						<div className="absolute right-0 bottom-0 flex h-32 w-64 items-end gap-1 p-6 opacity-30 transition-opacity group-hover:opacity-60">
							<div
								className="w-2 rounded-t bg-blue-500"
								style={{ height: "40%" }}
							/>
							<div
								className="w-2 rounded-t bg-blue-500"
								style={{ height: "70%" }}
							/>
							<div
								className="w-2 rounded-t bg-blue-500"
								style={{ height: "50%" }}
							/>
							<div
								className="w-2 rounded-t bg-blue-500"
								style={{ height: "90%" }}
							/>
							<div
								className="w-2 rounded-t bg-blue-500"
								style={{ height: "30%" }}
							/>
							<div
								className="w-2 rounded-t bg-blue-500"
								style={{ height: "60%" }}
							/>
							<div
								className="w-2 rounded-t bg-blue-500"
								style={{ height: "80%" }}
							/>
							<div
								className="w-2 rounded-t bg-blue-500"
								style={{ height: "45%" }}
							/>
							<div
								className="w-2 rounded-t bg-blue-500"
								style={{ height: "20%" }}
							/>
							<div
								className="w-2 rounded-t bg-blue-500"
								style={{ height: "75%" }}
							/>
							<div
								className="w-2 rounded-t bg-blue-500"
								style={{ height: "50%" }}
							/>
						</div>
					</div>
					<div className="rounded-md border border-slate-200 bg-white p-8 transition-shadow hover:shadow">
						<IconBadge className="mb-4" color="amber">
							<Timer size={20} weight="duotone" />
						</IconBadge>
						<h3 className="mb-2 font-semibold text-slate-900 text-xl">
							Chiến Thuật Làm Bài Nhanh
						</h3>
						<p className="text-slate-500">
							Học cách quản lý thời gian hiệu quả và áp dụng các chiến thuật làm
							bài để tối đa hóa điểm số trong kỳ thi TOEIC.
						</p>
					</div>
					<div className="rounded-md border border-slate-200 bg-white p-8 transition-shadow hover:shadow">
						<IconBadge className="mb-4" color="emerald">
							<Briefcase size={20} weight="duotone" />
						</IconBadge>
						<h3 className="mb-2 font-semibold text-slate-900 text-xl">
							Từ Vựng Chuyên Ngành
						</h3>
						<p className="text-slate-500">
							Mở rộng vốn từ vựng với các thuật ngữ thường gặp trong môi trường
							kinh doanh và công sở.
						</p>
					</div>
					<div className="flex flex-col items-center gap-8 rounded-md border border-slate-200 bg-white p-8 transition-shadow hover:shadow md:col-span-2 md:flex-row">
						<div className="flex-1">
							<IconBadge className="mb-4" color="purple">
								<ChartLine size={20} weight="duotone" />
							</IconBadge>
							<h3 className="mb-2 font-semibold text-slate-900 text-xl">
								Ước Lượng Điểm Số TOEIC
							</h3>
							<p className="text-slate-500">
								Sử dụng công cụ ước lượng điểm số TOEIC dựa trên hiệu suất làm
								bài của bạn trong các bài tập và mô phỏng thi.
							</p>
						</div>
						<div className="flex items-center gap-4 pr-8">
							<div className="text-center">
								<div className="mb-1 font-medium text-slate-400 text-xs uppercase">
									Điểm Hiện Tại
								</div>
								<div className="font-bold text-2xl text-slate-400">650</div>
							</div>
							<div className="relative h-[1px] w-24 bg-gradient-to-r from-slate-200 to-green-500">
								<div className="-right-1 -top-1 absolute h-2 w-2 rounded-full bg-green-500" />
							</div>
							<div className="text-center">
								<div className="mb-1 font-bold text-green-600 text-xs uppercase">
									Mục Tiêu
								</div>
								<div className="font-bold text-3xl text-slate-900">850+</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
