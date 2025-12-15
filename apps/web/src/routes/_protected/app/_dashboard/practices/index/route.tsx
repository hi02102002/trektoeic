import { createFileRoute } from "@tanstack/react-router";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { TsrBreadcrumbs } from "@/components/tsr-breadcrumbs";
import { ListeningSection } from "./_components/listening-section";
import { ReadingSection } from "./_components/reading-section";

export const Route = createFileRoute("/_protected/app/_dashboard/practices/")({
	component: RouteComponent,
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
