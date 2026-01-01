import { createFileRoute } from "@tanstack/react-router";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";

export const Route = createFileRoute("/_protected/app/_dashboard/vocabularies")(
	{
		component: RouteComponent,
		head: ({ match }) => {
			const { meta, links } = generateMetadata({
				title: "Từ vựng TOEIC",
				description:
					"Học từ vựng TOEIC quan trọng theo chủ đề. Nắm vững vốn từ vựng cần thiết để đạt điểm cao trong kỳ thi TOEIC.",
				keywords: [
					"từ vựng TOEIC",
					"học từ vựng TOEIC",
					"vocabulary TOEIC",
					"từ vựng theo chủ đề TOEIC",
					"từ vựng cần thiết TOEIC",
				],
				...createOpenGraphData(
					"Từ vựng TOEIC | TrekToeic",
					"Học từ vựng TOEIC quan trọng theo chủ đề. Nắm vững vốn từ vựng cần thiết để đạt điểm cao trong kỳ thi TOEIC.",
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
	},
);

function RouteComponent() {
	return <div>Hello "/_protected/app/_dashboard/vocabularies"!</div>;
}
