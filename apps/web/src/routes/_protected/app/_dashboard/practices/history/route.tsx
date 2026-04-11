import { createFileRoute } from "@tanstack/react-router";
import { createStandardSchemaV1, parseAsInteger } from "nuqs";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { Card, CardContent } from "@/components/ui/card";
import { HistoryDataTable } from "./_components/history-data-table";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/practices/history",
)({
	validateSearch: createStandardSchemaV1(
		{
			page: parseAsInteger.withDefault(1),
			perPage: parseAsInteger.withDefault(10),
		},
		{
			partialOutput: true,
		},
	),
	loaderDeps(opts) {
		return opts.search;
	},
	loader: async ({ context, deps }) => {
		const histories = await context.queryClient.ensureQueryData(
			context.orpc.partPractices.getPartPracticeHistories.queryOptions({
				input: {
					page: deps.page,
					limit: deps.perPage,
				},
			}),
		);

		return { histories };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { histories } = Route.useLoaderData();

	console.log(histories);

	return (
		<AppContent
			header={
				<AppHeader
					title="Lịch sử luyện tập"
					description="Xem lại các lần luyện tập từng Part trước đây để theo dõi tiến bộ của bạn."
				/>
			}
		>
			<div className="space-y-6">
				{histories.items.length === 0 && (
					<Card>
						<CardContent>
							<p className="text-neutral-500 text-sm">
								Bạn chưa có lịch sử luyện tập nào. Hãy bắt đầu một bài luyện tập
								để xem lịch sử tại đây.
							</p>
						</CardContent>
					</Card>
				)}

				<HistoryDataTable histories={histories} />
			</div>
		</AppContent>
	);
}
