import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { buttonVariants } from "@/components/ui/button";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { VocabularyCard } from "./_components/vocabulary-card";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/vocabularies/explore/$slug/",
)({
	loaderDeps: ({ search }) => search,
	loader: async ({ context, params }) => {
		const category = await context.queryClient.ensureQueryData(
			context.orpc.vocabularies.getCategoryBySlug.queryOptions({
				input: { slug: params.slug },
			}),
		);

		if (!category) {
			throw notFound();
		}

		const vocabularies = await context.queryClient.ensureQueryData(
			context.orpc.vocabularies.getVocabulariesByCategoryId.queryOptions({
				input: {
					categoryId: category.id,
				},
			}),
		);

		return { category, vocabularies };
	},
	component: RouteComponent,
	head: ({ match, loaderData }) => {
		const title = loaderData?.category?.name ?? "Category";
		const description = `Study vocabulary for ${title}.`;
		const { meta, links } = generateMetadata({
			title: `${title} | Từ vựng`,
			description,
			keywords: ["từ vựng TOEIC", title, "vocabulary"],
			...createOpenGraphData(
				`${title} | TrekToeic`,
				description,
				match.pathname,
			),
			robots: { index: false, follow: false },
			alternates: { canonical: match.pathname },
		});
		return { meta, links };
	},
});

function RouteComponent() {
	const { category, vocabularies } = Route.useLoaderData();
	const { user } = Route.useRouteContext();

	return (
		<AppContent
			header={
				<AppHeader
					title={category.name}
					description={
						<>
							Chào{" "}
							<span className="font-medium text-primary">
								{user?.user.name ?? "bạn"}
							</span>
							, đây là danh sách từ vựng trong chủ đề {category.name}.
						</>
					}
					className="max-w-2xl"
				/>
			}
		>
			<div className="space-y-6">
				<div className="flex justify-end">
					<Link
						to="/app/vocabularies/review"
						search={{ categoryId: category.id }}
						className={cn(buttonVariants({ size: "sm" }), "font-medium")}
					>
						Học ngay
					</Link>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{vocabularies.items.map((word) => (
						<VocabularyCard key={word.id} word={word} />
					))}
				</div>
			</div>
		</AppContent>
	);
}
