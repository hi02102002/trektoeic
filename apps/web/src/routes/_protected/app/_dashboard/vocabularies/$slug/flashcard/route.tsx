import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { Button } from "@/components/ui/button";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { VocabularyReviewSession } from "../index/_components/vocabulary-review-session";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/vocabularies/$slug/flashcard",
)({
	loader: async ({ context, params }) => {
		const category = await context.queryClient.ensureQueryData(
			context.orpc.vocabularies.getCategoryBySlug.queryOptions({
				input: { slug: params.slug },
			}),
		);

		if (!category) {
			throw notFound();
		}

		const dueVocabularies = await context.queryClient.ensureQueryData(
			context.orpc.vocabularyReview.getDueVocabularies.queryOptions({
				input: {
					categoryId: category.id,
					limit: 50,
				},
			}),
		);

		return { category, dueVocabularies };
	},
	component: RouteComponent,
	head: ({ match, loaderData }) => {
		const title = loaderData?.category?.name ?? "Flashcard";
		const description = `Study due flashcards in ${title}.`;
		const { meta, links } = generateMetadata({
			title: `${title} Flashcards | Từ vựng`,
			description,
			keywords: ["flashcard TOEIC", "ôn tập từ vựng", title],
			...createOpenGraphData(
				`${title} Flashcards | TrekToeic`,
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
	const { category, dueVocabularies } = Route.useLoaderData();

	return (
		<AppContent
			header={
				<AppHeader
					title={`${category.name} Flashcards`}
					description="Ôn tập từ vựng đến hạn với chế độ flashcard."
					className="max-w-2xl"
					right={
						<div className="mt-4">
							<Button asChild variant="outline" size="sm">
								<Link
									to="/app/vocabularies/$slug"
									params={{ slug: category.slug }}
									search={{ page: 1 }}
								>
									Back to category
								</Link>
							</Button>
						</div>
					}
				/>
			}
		>
			<VocabularyReviewSession
				category={category}
				items={dueVocabularies ?? []}
			/>
		</AppContent>
	);
}
