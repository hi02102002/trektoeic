import { createFileRoute, notFound } from "@tanstack/react-router";

import { AppContent, AppHeader } from "@/components/layouts/app";
import { OverallScore } from "./_components/overrall-scrore";
import { ScoreBreakdown } from "./_components/score-breakdown";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/mock-test/$slug_/$historyId",
)({
	async loader({ params, context }) {
		const { historyId } = params;
		const result = await context.queryClient.ensureQueryData(
			context.orpc.mockTest.getMockTestByHistoryId.queryOptions({
				input: { historyId },
			}),
		);

		if (!result) {
			throw notFound();
		}

		return {
			result,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const {
		result: { history },
	} = Route.useLoaderData();

	return (
		<AppContent
			header={<AppHeader title={`Kết quả: ${history.metadata.title}`} />}
		>
			<div className="mx-auto max-w-7xl space-y-6">
				<OverallScore />
				<ScoreBreakdown />
			</div>
		</AppContent>
	);
}
