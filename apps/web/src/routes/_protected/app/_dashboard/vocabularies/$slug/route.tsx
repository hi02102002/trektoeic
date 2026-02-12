import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { Button } from "@/components/ui/button";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { client } from "@/lib/orpc/orpc";
import { CategoryDetailHero } from "./_components/category-detail-hero";
import { VocabularyCard } from "./_components/vocabulary-card";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/vocabularies/$slug",
)({
	loader: async ({ context, params }) => {
		const category = await context.queryClient.ensureQueryData(
			context.orpc.vocabularies.getCategoryBySlug.queryOptions({
				input: { slug: params.slug },
			}),
		);
		if (!category) throw notFound();
		const parentCategory = category.parentId
			? await context.queryClient.ensureQueryData(
					context.orpc.vocabularies.getCategoryById.queryOptions({
						input: { id: category.parentId },
					}),
				)
			: null;
		return { category, parentCategory };
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

const WORDS_PER_PAGE = 12;

function RouteComponent() {
	const { category, parentCategory } = Route.useLoaderData();

	const vocabulariesQuery = useInfiniteQuery({
		queryKey: ["vocabularies", "byCategory", category.id],
		queryFn: async ({ pageParam }) => {
			return client.vocabularies.getVocabulariesByCategoryId({
				categoryId: category.id,
				page: pageParam as number,
				limit: WORDS_PER_PAGE,
			});
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length === WORDS_PER_PAGE ? allPages.length + 1 : undefined,
	});

	const words = useMemo(
		() => vocabulariesQuery.data?.pages.flat() ?? [],
		[vocabulariesQuery.data],
	);
	const totalWords = category.totalWords ?? 0;
	const hasMore = vocabulariesQuery.hasNextPage;
	const isFetchingMore = vocabulariesQuery.isFetchingNextPage;

	return (
		<AppContent
			header={
				<AppHeader
					title={category.name}
					description={
						parentCategory
							? undefined
							: "Học từ vựng TOEIC theo chủ đề. Nắm vững vốn từ cần thiết."
					}
					className="max-w-2xl"
				/>
			}
		>
			<div className="space-y-6">
				<CategoryDetailHero category={category} totalWords={totalWords} />
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{words.map((word) => (
						<VocabularyCard key={word.id} word={word} />
					))}
				</div>
				{hasMore && (
					<div className="flex justify-center">
						<Button
							variant="ghost"
							className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
							onClick={() => vocabulariesQuery.fetchNextPage()}
							disabled={isFetchingMore}
						>
							{isFetchingMore ? "Loading..." : "Load more words"}
						</Button>
					</div>
				)}
			</div>
		</AppContent>
	);
}
