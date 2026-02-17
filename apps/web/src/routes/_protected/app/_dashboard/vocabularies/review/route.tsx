import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { VocabularyReviewSession } from "./_components/vocabulary-review-session";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/vocabularies/review",
)({
	validateSearch: z.object({
		categoryId: z.string().optional(),
	}),
	loaderDeps(opts) {
		return opts.search;
	},
	loader: async ({ context, deps }) => {
		const [category, dueVocabularies] = await Promise.all([
			deps.categoryId
				? context.queryClient.ensureQueryData(
						context.orpc.vocabularies.getCategoryById.queryOptions({
							input: {
								id: deps.categoryId,
							},
						}),
					)
				: Promise.resolve(null),
			context.queryClient.ensureQueryData(
				context.orpc.vocabularyReview.getDueVocabularies.queryOptions({
					input: {
						categoryId: deps.categoryId ?? "",
						limit: 50,
					},
				}),
			),
		]);

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
					title={category ? `Ôn tập: ${category.name}` : "Ôn tập từ vựng"}
					description="Ôn tập từ vựng đến hạn với chế độ flashcard."
					className="max-w-2xl"
				/>
			}
		>
			<VocabularyReviewSession
				category={category ?? undefined}
				items={dueVocabularies ?? []}
			/>
		</AppContent>
	);
}
