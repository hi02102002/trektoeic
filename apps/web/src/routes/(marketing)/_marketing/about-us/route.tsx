import {
	HeartIcon,
	LightbulbIcon,
	RocketLaunchIcon,
	UsersThreeIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IconBadge } from "@/components/icon-badge";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";

export const Route = createFileRoute("/(marketing)/_marketing/about-us")({
	component: AboutUsPage,
	head: ({ match }) => {
		const { meta, links } = generateMetadata({
			title: "Giới thiệu TrekToeic",
			description:
				"TrekToeic là nền tảng luyện thi TOEIC trực tuyến: luyện theo Part, thi thử có phân tích, từ vựng và ngữ pháp — giúp bạn học có lộ trình, theo dõi tiến độ rõ ràng.",
			keywords: [
				"TrekToeic",
				"giới thiệu TrekToeic",
				"học TOEIC online",
				"nền tảng TOEIC",
				"luyện TOEIC",
			],
			...createOpenGraphData(
				"TrekToeic — Giới thiệu",
				"Đồng hành cùng bạn chinh phục TOEIC với công cụ luyện tập hiện đại, thống nhất từ landing đến không gian học trong app.",
				match.pathname,
			),
			alternates: {
				canonical: match.pathname,
			},
		});

		return { meta, links };
	},
});

function AboutUsPage() {
	return (
		<>
			<section className="relative overflow-hidden border-border border-b bg-landing-surface bg-neutral-50 pt-28 pb-16 md:pb-20">
				<div className="pointer-events-none absolute top-24 right-0 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl md:h-80 md:w-80" />
				<div className="container relative z-10 mx-auto max-w-3xl px-4 text-center">
					<div className="mb-4 inline-flex items-center gap-2 rounded-none border border-border bg-card px-3 py-1 font-medium text-muted-foreground text-xs shadow-none ring-1 ring-foreground/10">
						<span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
						Về chúng tôi
					</div>
					<h1 className="mb-5 font-heading font-semibold text-3xl text-neutral-900 tracking-tight sm:text-4xl md:text-5xl">
						Chúng tôi tin vào luyện TOEIC{" "}
						<span className="text-blue-600">có hệ thống</span>
					</h1>
					<p className="mx-auto max-w-2xl text-base text-neutral-600 leading-relaxed md:text-lg">
						TrekToeic được xây dựng để bạn không chỉ “làm nhiều đề” mà còn hiểu
						điểm mạnh — yếu theo từng Part, ôn từ vựng có lịch và theo dõi tiến
						độ theo thời gian thực.
					</p>
					<div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
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
							<Link to="/">Về trang chủ</Link>
						</Button>
					</div>
				</div>
			</section>

			<section className="border-border border-t bg-neutral-50 py-16 md:py-20">
				<div className="container mx-auto max-w-6xl px-4">
					<Card className="shadow-none ring-1 ring-foreground/10">
						<CardContent className="p-8 md:p-10">
							<IconBadge className="mb-5 rounded-none">
								<RocketLaunchIcon size={22} weight="duotone" />
							</IconBadge>
							<h2 className="mb-3 font-heading font-semibold text-2xl text-neutral-900 tracking-tight md:text-3xl">
								Sứ mệnh
							</h2>
							<p className="max-w-3xl text-neutral-600 text-sm leading-relaxed md:text-base">
								Giúp người học tiếng Anh phục vụ công việc và chứng chỉ có một
								lộ trình luyện TOEIC rõ ràng: từ luyện từng kỹ năng, thi thử có
								phản hồi, đến củng cố từ vựng và ngữ pháp — tất cả trong một
								trải nghiệm gọn, nhất quán.
							</p>
						</CardContent>
					</Card>

					<div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
						<Card className="shadow-none ring-1 ring-foreground/10 transition-shadow hover:shadow-sm">
							<CardContent className="p-6 md:p-8">
								<IconBadge className="mb-4 rounded-none" color="emerald">
									<UsersThreeIcon size={20} weight="duotone" />
								</IconBadge>
								<h3 className="mb-2 font-heading font-semibold text-lg text-neutral-900">
									Lấy người học làm trung tâm
								</h3>
								<p className="text-neutral-600 text-sm leading-relaxed md:text-base">
									Giao diện và luồng làm bài được thiết kế để bạn vào luyện
									nhanh, ít ma sát — từ marketing đến app dùng cùng một ngôn ngữ
									thị giác.
								</p>
							</CardContent>
						</Card>
						<Card className="shadow-none ring-1 ring-foreground/10 transition-shadow hover:shadow-sm">
							<CardContent className="p-6 md:p-8">
								<IconBadge className="mb-4 rounded-none" color="amber">
									<LightbulbIcon size={20} weight="duotone" />
								</IconBadge>
								<h3 className="mb-2 font-heading font-semibold text-lg text-neutral-900">
									Dữ liệu phục vụ quyết định
								</h3>
								<p className="text-neutral-600 text-sm leading-relaxed md:text-base">
									Thi thử và luyện Part gắn với thống kê — để bạn biết nên ưu
									tiên phần nào thay vì chỉ nhìn một con số tổng.
								</p>
							</CardContent>
						</Card>
						<Card className="shadow-none ring-1 ring-foreground/10 transition-shadow hover:shadow-sm">
							<CardContent className="p-6 md:p-8">
								<IconBadge className="mb-4 rounded-none" color="purple">
									<HeartIcon size={20} weight="duotone" />
								</IconBadge>
								<h3 className="mb-2 font-heading font-semibold text-lg text-neutral-900">
									Bền vững, không “ăn xổi”
								</h3>
								<p className="text-neutral-600 text-sm leading-relaxed md:text-base">
									Từ vựng có ôn lại, ngữ pháp theo chủ đề — hỗ trợ nền tảng lâu
									dài cho điểm Listening và Reading.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section className="border-border border-t bg-neutral-50 px-4 py-16 md:py-20">
				<div className="container mx-auto max-w-5xl">
					<div className="relative overflow-hidden rounded-none border border-border bg-foreground px-8 py-14 text-center shadow-none ring-1 ring-foreground/10 md:px-16 md:py-20">
						<div className="pointer-events-none absolute top-0 left-1/2 h-[280px] w-[min(100%,560px)] -translate-x-1/2 bg-blue-600/25 opacity-80 blur-3xl" />
						<div className="relative z-10">
							<h2 className="mb-4 font-heading font-semibold text-2xl text-primary-foreground tracking-tight md:mb-5 md:text-4xl">
								Sẵn sàng luyện cùng TrekToeic?
							</h2>
							<p className="mx-auto mb-8 max-w-lg text-primary-foreground/80 text-sm leading-relaxed md:mb-10 md:text-base">
								Đăng nhập để vào dashboard: mock test, practice theo Part, từ
								vựng và ngữ pháp — cùng một phong cách giao diện bạn đã thấy ở
								đây.
							</p>
							<Button
								variant="secondary"
								className="h-11 min-h-11 rounded-none px-8 font-semibold text-sm"
								asChild
							>
								<Link to="/login">Vào ứng dụng</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			<ScrollToTop />
		</>
	);
}
