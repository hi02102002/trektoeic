import { createFileRoute } from "@tanstack/react-router";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";

export const Route = createFileRoute("/_protected/app/_dashboard/mock-test")({
	component: RouteComponent,
	head: ({ match }) => {
		const { meta, links } = generateMetadata({
			title: "Thi thử TOEIC",
			description:
				"Làm đề thi thử TOEIC theo format chuẩn với thời gian thực tế. Đánh giá trình độ và chuẩn bị tốt nhất cho kỳ thi TOEIC thật.",
			keywords: [
				"thi thử TOEIC",
				"đề thi thử TOEIC",
				"mock test TOEIC",
				"practice test TOEIC",
				"đề TOEIC miễn phí",
				"full test TOEIC",
			],
			...createOpenGraphData(
				"Thi thử TOEIC | TrekToeic",
				"Làm đề thi thử TOEIC theo format chuẩn với thời gian thực tế. Đánh giá trình độ và chuẩn bị tốt nhất cho kỳ thi TOEIC thật.",
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
	return <div>Hello "/_protected/app/_dashboard/mock-test"!</div>;
}
