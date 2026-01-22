import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { TsrBreadcrumbs } from "@/components/tsr-breadcrumbs";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { MockTestInfo } from "./_components/mock-test-info";
import { MockTestInstructions } from "./_components/mock-test-instructions";
import { MockTestParts } from "./_components/mock-test-parts";
import { MockTestStartButton } from "./_components/mock-test-start-button";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/mock-test/$slug",
)({
	validateSearch: z.object({
		action: z.enum(["start", "continue"]).optional(),
	}),
	component: RouteComponent,
	async loader({ context, params }) {
		const kit = await context.queryClient.ensureQueryData(
			context.orpc.kits.getKitBySlug.queryOptions({
				input: { slug: params.slug },
			}),
		);

		if (!kit) {
			throw new Error("Kit not found");
		}

		return { kit };
	},
	head: ({ loaderData }) => {
		const kit = loaderData?.kit;

		const { meta, links } = generateMetadata({
			title: kit?.name ?? "Đề thi TOEIC",
			description: `Làm đề thi thử ${kit?.name ?? "TOEIC"} theo format chuẩn với thời gian thực tế. 200 câu hỏi, 120 phút làm bài.`,
			keywords: [
				"thi thử TOEIC",
				"đề thi thử TOEIC",
				kit?.name ?? "",
				"mock test TOEIC",
				"full test TOEIC",
			].filter(Boolean),
			...createOpenGraphData(
				`${kit?.name ?? "Đề thi TOEIC"} | TrekToeic`,
				`Làm đề thi thử ${kit?.name ?? "TOEIC"} theo format chuẩn với thời gian thực tế.`,
				`/app/mock-test/${kit?.slug ?? ""}`,
			),
			robots: {
				index: false,
				follow: false,
			},
		});

		return { meta, links };
	},
});

function RouteComponent() {
	const { kit } = Route.useLoaderData();

	return (
		<AppContent
			header={<AppHeader title={kit.name} />}
			breadcrumbs={
				<TsrBreadcrumbs
					breadcrumbs={[
						{ label: "Trang chủ", to: "/app" },
						{ label: "Thư viện đề thi", to: "/app/mock-test" },
						{
							label: kit.name,
							to: "/app/mock-test/$slug",
							params: { slug: kit.slug },
						},
					]}
				/>
			}
		>
			<div className="grid gap-6 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<MockTestInstructions />
					<MockTestParts />
				</div>
				<div className="space-y-6">
					<MockTestInfo kit={kit} />
					<MockTestStartButton kit={kit} />
				</div>
			</div>
		</AppContent>
	);
}
