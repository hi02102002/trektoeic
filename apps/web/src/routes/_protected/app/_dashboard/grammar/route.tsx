import { createFileRoute } from "@tanstack/react-router";
import { generateMetadata } from "@/lib/meta";

export const Route = createFileRoute("/_protected/app/_dashboard/grammar")({
	component: RouteComponent,
	head: () => {
		const { meta, links } = generateMetadata({
			title: "Ngữ pháp TOEIC",
			description:
				"Học ngữ pháp TOEIC cơ bản đến nâng cao. Nắm vững các cấu trúc ngữ pháp quan trọng để đạt điểm cao trong phần Reading và Listening.",
			keywords: [
				"ngữ pháp TOEIC",
				"học ngữ pháp TOEIC",
				"grammar TOEIC",
				"cấu trúc ngữ pháp TOEIC",
				"ngữ pháp cơ bản TOEIC",
			],
			robots: {
				index: false,
				follow: false,
			},
			alternates: {
				canonical: "/app/grammar",
			},
		});

		return { meta, links };
	},
});

function RouteComponent() {
	return <div>Hello "/_protected/app/_dashboard/grammar"!</div>;
}
