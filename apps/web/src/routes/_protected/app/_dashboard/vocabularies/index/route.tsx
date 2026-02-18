import { createFileRoute } from "@tanstack/react-router";
import {
	createSortInputSchema,
	PaginationInputSchema,
	QueryInputSchema,
} from "@trektoeic/schemas/share-schema";
import z from "zod";
import { AppContent } from "@/components/layouts/app";
import { VocabularyCollectionsSection } from "./_components/vocabulary-collections-section";
import { VocabularyDashboardHeader } from "./_components/vocabulary-dashboard-header";
import { VocabularyInsightsSidebar } from "./_components/vocabulary-insights-sidebar";
import { VocabularyStatsGrid } from "./_components/vocabulary-stats-grid";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/vocabularies/",
)({
	validateSearch: z.object(PaginationInputSchema.shape).extend({
		query: QueryInputSchema.optional(),
		sort: createSortInputSchema([
			"du.updatedAt",
			"du.createdAt",
			"vc.name",
		] as const),
	}),
	loaderDeps(opts) {
		return opts.search;
	},
	loader: async ({ context, deps }) => {
		const [stats, dueWords, categories] = await Promise.all([
			context.queryClient.ensureQueryData(
				context.orpc.vocabularyReview.getStats.queryOptions({
					input: {},
				}),
			),
			context.queryClient.ensureQueryData(
				context.orpc.vocabularyReview.getDueVocabularies.queryOptions({
					input: {
						limit: 50,
					},
				}),
			),
			context.queryClient.ensureQueryData(
				context.orpc.deckOfUsers.getDeckOfUser.queryOptions({
					input: deps,
				}),
			),
		]);

		return { stats, dueWords, categories };
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AppContent header={<VocabularyDashboardHeader />}>
			<div className="space-y-6">
				<VocabularyStatsGrid />

				<div className="grid gap-6 xl:grid-cols-12">
					<VocabularyCollectionsSection />
					<VocabularyInsightsSidebar />
				</div>
			</div>
		</AppContent>
	);
}
