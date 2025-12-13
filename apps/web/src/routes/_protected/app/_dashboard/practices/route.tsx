import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/layouts/app";
import { ListeningSection } from "./_components/listening-section";
import { ReadingSection } from "./_components/reading-section";

export const Route = createFileRoute("/_protected/app/_dashboard/practices")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<AppHeader
				title="Luyện tập"
				description="Chọn phần cụ thể để tập trung luyện tập. Chúng tôi khuyên bạn nên hoàn thành ít nhất một module Nghe và một module Đọc mỗi ngày để đạt hiệu quả tối ưu."
			/>
			<div className="space-y-16">
				<ListeningSection />
				<ReadingSection />
			</div>
		</div>
	);
}
