import { createFileRoute } from "@tanstack/react-router";
import { createOrderByInputSchema } from "@trektoeic/schemas/share-schema";
import z from "zod";
import { AppContent, AppHeader } from "@/components/layouts/app";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { MockTestCard, MockTestFilter } from "../_components";

export const Route = createFileRoute("/_protected/app/_dashboard/mock-test/")({
	validateSearch: z.object({
		search: z.string().optional(),
		year: z.union([z.literal("all"), z.coerce.number<number>()]).optional(),
		orderBy: createOrderByInputSchema(["year"] as const).optional(),
	}),
	loaderDeps(opts) {
		return opts.search;
	},
	component: RouteComponent,
	async loader({ context, deps }) {
		const [kits, years] = await Promise.all([
			context.queryClient.ensureQueryData(
				context.orpc.kits.getAllKits.queryOptions({
					input: {
						year: deps.year || "all",
						orderBy: deps.orderBy,
					},
				}),
			),
			context.queryClient.ensureQueryData(
				context.orpc.kits.getAvailableKitYears.queryOptions(),
			),
		]);

		return { kits, years };
	},
	head: ({ match }) => {
		const { meta, links } = generateMetadata({
			title: "Thư viện đề thi TOEIC",
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
				"Thư viện đề thi TOEIC | TrekToeic",
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
	const { kits } = Route.useLoaderData();

	return (
		<AppContent
			header={
				<AppHeader
					title="Thư viện đề thi"
					description="Luyện tập với các đề thi TOEIC theo format chuẩn. Đánh giá trình độ và chuẩn bị tốt nhất cho kỳ thi thật."
					className="max-w-2xl"
				/>
			}
		>
			<div className="space-y-6">
				<MockTestFilter />
				<div className="flex items-center justify-between border-neutral-200 border-b pb-4">
					<p className="text-neutral-500 text-sm">{kits.length} đề thi</p>
				</div>

				{kits.length > 0 ? (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{kits.map((kit) => (
							<MockTestCard key={kit.id} kit={kit} />
						))}
					</div>
				) : (
					<Empty>
						<EmptyHeader>
							<EmptyTitle>Không tìm thấy đề thi</EmptyTitle>
							<EmptyDescription>
								Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				)}
			</div>
		</AppContent>
	);
}
