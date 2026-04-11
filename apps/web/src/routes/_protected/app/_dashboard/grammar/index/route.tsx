import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { GrammarTopicsGrid } from "../_components";

export const Route = createFileRoute("/_protected/app/_dashboard/grammar/")({
	loader: async ({ context }) => {
		const topics = await context.queryClient.ensureQueryData(
			context.orpc.grammar.listTopics.queryOptions(),
		);
		return { topics };
	},
	component: RouteComponent,
	head: ({ match }) => {
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
			...createOpenGraphData(
				"Ngữ pháp TOEIC | TrekToeic",
				"Học ngữ pháp TOEIC cơ bản đến nâng cao. Nắm vững các cấu trúc ngữ pháp quan trọng để đạt điểm cao.",
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
	const { topics } = Route.useLoaderData();

	const byCourse = useMemo(() => {
		const map = new Map<
			string,
			{ courseTitle: string; topics: typeof topics }
		>();
		for (const t of topics) {
			const cur = map.get(t.courseSlug);
			if (cur) cur.topics.push(t);
			else map.set(t.courseSlug, { courseTitle: t.courseTitle, topics: [t] });
		}
		return [...map.entries()];
	}, [topics]);

	return (
		<AppContent
			header={
				<AppHeader
					title="Ngữ pháp TOEIC"
					description="Chọn khóa và chủ đề — lý thuyết (bảng, ví dụ) và bài tập trắc nghiệm theo format đề TOEIC."
					className="max-w-2xl"
				/>
			}
		>
			<div className="space-y-10">
				<p className="text-neutral-500 text-sm">
					{topics.length} chủ đề · {byCourse.length} khóa · cập nhật dần theo
					nhu cầu ôn thi
				</p>
				<GrammarTopicsGrid byCourse={byCourse} />
			</div>
		</AppContent>
	);
}
