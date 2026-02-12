import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { CategoriesList } from "./_components/categories-list";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/vocabularies/",
)({
	validateSearch: z.object({
		parentId: z.string().optional(),
		level: z.number().optional().default(1),
	}),
	loaderDeps(opts) {
		return opts.search;
	},
	loader: async ({ context, deps }) => {
		const [categories, category] = await Promise.all([
			context.queryClient.ensureQueryData(
				context.orpc.vocabularies.getAllCategories.queryOptions({
					input: {
						parentId: deps.parentId,
						level: deps.level,
					},
				}),
			),
			deps.parentId
				? context.queryClient.ensureQueryData(
						context.orpc.vocabularies.getCategoryById.queryOptions({
							input: { id: deps.parentId },
						}),
					)
				: null,
		]);

		return { categories, category };
	},
	component: RouteComponent,
	head: ({ match, loaderData }) => {
		const { meta, links } = generateMetadata({
			title: loaderData?.category?.name ?? "Từ vựng theo chủ đề",
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
});

function RouteComponent() {
	const { category } = Route.useLoaderData();

	return (
		<AppContent
			header={
				<AppHeader
					title={category ? category.name : "Từ vựng theo chủ đề"}
					description={
						category
							? undefined
							: "Học từ vựng TOEIC quan trọng theo chủ đề. Nắm vững vốn từ vựng cần thiết để đạt điểm cao trong kỳ thi TOEIC."
					}
					className="max-w-2xl"
				/>
			}
		>
			<div className="space-y-6">
				<CategoriesList />
			</div>
		</AppContent>
	);
}
