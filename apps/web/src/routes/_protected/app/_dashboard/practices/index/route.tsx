import { createFileRoute } from "@tanstack/react-router";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { TsrBreadcrumbs } from "@/components/tsr-breadcrumbs";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { ListeningSection } from "./_components/listening-section";
import { ReadingSection } from "./_components/reading-section";

export const Route = createFileRoute("/_protected/app/_dashboard/practices/")({
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

function RouteComponent() {
	return (
		<AppContent
			header={
				<AppHeader
					title="Luyện tập"
					description="Chọn phần cụ thể để tập trung luyện tập. Chúng tôi khuyên bạn nên hoàn thành ít nhất một module Nghe và một module Đọc mỗi ngày để đạt hiệu quả tối ưu."
				/>
			}
			breadcrumbs={
				<TsrBreadcrumbs
					breadcrumbs={[
						{ label: "Trang chủ", to: "/app" },
						{ label: "Luyện tập", to: "/app/practices" },
					]}
				/>
			}
		>
			<div className="space-y-16">
				<ListeningSection />
				<ReadingSection />
			</div>
		</AppContent>
	);
}
