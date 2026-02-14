import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import z from "zod";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { Button } from "@/components/ui/button";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { CategoryDetailHero } from "./_components/category-detail-hero";
import { VocabularyCard } from "./_components/vocabulary-card";
import { VocabularyPagination } from "./_components/vocabulary-pagination";

const WORDS_PER_PAGE = 12;

export const Route = createFileRoute(
	"/_protected/app/_dashboard/vocabularies/$slug/",
)({
	validateSearch: z.object({
		page: z.number().int().positive().optional().default(1),
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, params, deps }) => {
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
					limit: WORDS_PER_PAGE,
					page: deps.page,
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
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const page = search.page ?? 1;

	const goToPage = (nextPage: number) => {
		const clampedPage = Math.max(
			1,
			Math.min(nextPage, vocabularies?.pagination?.totalPages ?? 1),
		);
		void navigate({
			to: "/app/vocabularies/$slug",
			params: { slug: category.slug },
			search: { page: clampedPage },
		});
	};

	return (
		<AppContent
			header={
				<AppHeader
					title={category.name}
					description={
						"Học từ vựng TOEIC theo chủ đề. Nắm vững vốn từ cần thiết."
					}
					className="max-w-2xl"
					right={
						<div className="mt-4">
							<Button asChild variant="outline" size="sm">
								<Link
									to="/app/vocabularies/$slug/flashcard"
									params={{ slug: category.slug }}
								>
									Start daily review
								</Link>
							</Button>
						</div>
					}
				/>
			}
		>
			<div className="space-y-6">
				<CategoryDetailHero
					category={category}
					totalWords={vocabularies.pagination?.totalItems ?? 0}
				/>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{vocabularies.items.map((word) => (
						<VocabularyCard key={word.id} word={word} />
					))}
				</div>
				<VocabularyPagination
					page={page}
					totalPages={vocabularies.pagination?.totalPages ?? 0}
					onPageChange={goToPage}
				/>
			</div>
		</AppContent>
	);
}
