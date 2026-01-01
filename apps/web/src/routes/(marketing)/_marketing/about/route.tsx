import { createFileRoute } from "@tanstack/react-router";
import { generateMetadata } from "@/lib/meta";

export const Route = createFileRoute("/(marketing)/_marketing/about")({
	component: RouteComponent,
	head: () => {
		const { meta, links } = generateMetadata({
			title: "Về TrekToeic",
			description:
				"Tìm hiểu về TrekToeic - nền tảng học TOEIC trực tuyến được phát triển để giúp học viên Việt Nam đạt điểm cao TOEIC một cách hiệu quả nhất. Sứ mệnh, tầm nhìn và phương pháp học của chúng tôi.",
			keywords: [
				"về TrekToeic",
				"giới thiệu TrekToeic",
				"nền tảng học TOEIC",
				"phương pháp học TOEIC",
				"học TOEIC online Vietnam",
			],
			openGraph: {
				type: "website",
				url: "/about",
				title: "Về TrekToeic - Hành trình chinh phục TOEIC của bạn",
				description:
					"Tìm hiểu về TrekToeic - nền tảng học TOEIC trực tuyến được phát triển để giúp học viên Việt Nam đạt điểm cao TOEIC.",
			},
			alternates: {
				canonical: "/about",
			},
		});

		return { meta, links };
	},
});

function RouteComponent() {
	return <div>Hello "/(marketing)/_marketing/about"!</div>;
}
