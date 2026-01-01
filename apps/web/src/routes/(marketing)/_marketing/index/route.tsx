import { createFileRoute } from "@tanstack/react-router";
import { ScrollToTop } from "@/components/scroll-to-top";
import { generateMetadata } from "@/lib/meta";
import { ComparisonSection } from "./_components/comparison-section";
import { CtaSection } from "./_components/cta-section";
import { FeaturesBentoGrid } from "./_components/feature-bento-grid";
import { HeroSection } from "./_components/hero-section";

export const Route = createFileRoute("/(marketing)/_marketing/")({
	component: HomeComponent,
	head: () => {
		const { meta, links } = generateMetadata({
			title: "Nền tảng học TOEIC trực tuyến hiệu quả",
			description:
				"Học TOEIC hiệu quả với TrekToeic - nền tảng luyện thi TOEIC trực tuyến. Luyện tập từng phần, làm đề thi thử, học từ vựng và ngữ pháp. Đạt điểm cao TOEIC cùng phương pháp học thông minh.",
			keywords: [
				"học TOEIC",
				"luyện thi TOEIC",
				"TOEIC online",
				"luyện TOEIC trực tuyến",
				"đề thi TOEIC miễn phí",
				"TOEIC listening",
				"TOEIC reading",
				"luyện TOEIC từng phần",
				"thi thử TOEIC",
			],
			openGraph: {
				type: "website",
				url: "/",
				title: "TrekToeic - Nền tảng học TOEIC trực tuyến hiệu quả",
				description:
					"Học TOEIC hiệu quả với TrekToeic - nền tảng luyện thi TOEIC trực tuyến. Luyện tập từng phần, làm đề thi thử, học từ vựng và ngữ pháp.",
			},
			twitter: {
				card: "summary_large_image",
				title: "TrekToeic - Nền tảng học TOEIC trực tuyến hiệu quả",
				description:
					"Học TOEIC hiệu quả với TrekToeic - nền tảng luyện thi TOEIC trực tuyến. Luyện tập từng phần, làm đề thi thử, học từ vựng và ngữ pháp.",
			},
			alternates: {
				canonical: "/",
			},
		});

		return { meta, links };
	},
});

function HomeComponent() {
	return (
		<>
			<HeroSection />
			<FeaturesBentoGrid />
			<ComparisonSection />
			<CtaSection />
			<ScrollToTop />
		</>
	);
}
