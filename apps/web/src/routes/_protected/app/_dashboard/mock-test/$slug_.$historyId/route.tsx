import { createFileRoute, notFound } from "@tanstack/react-router";

import { AppContent, AppHeader } from "@/components/layouts/app";
import { TsrBreadcrumbs } from "@/components/tsr-breadcrumbs";
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
	const { historyId, slug } = Route.useParams();
	const {
		result: { history },
	} = Route.useLoaderData();

	return (
		<AppContent
			header={<AppHeader title={`Kết quả: ${history.metadata.title}`} />}
			breadcrumbs={
				<TsrBreadcrumbs
					breadcrumbs={[
						{ label: "Trang chủ", to: "/app" },
						{ label: "Thư viện đề thi", to: "/app/mock-test" },
						{
							label: `Kết quả: ${history.metadata.title}`,
							to: "/app/mock-test/$slug/$historyId",
							params: {
								slug,
								historyId,
							},
						},
					]}
				/>
			}
		>
			<div className="mx-auto max-w-7xl space-y-6">
				<OverallScore />
				<ScoreBreakdown />
			</div>
		</AppContent>
	);
}
