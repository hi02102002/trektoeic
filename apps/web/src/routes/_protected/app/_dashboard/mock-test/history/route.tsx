import { createFileRoute } from "@tanstack/react-router";
import { createStandardSchemaV1, parseAsInteger } from "nuqs";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { MockTestHistoryDataTable } from "./_components/mock-test-history-data-table";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/mock-test/history",
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
			context.orpc.mockTest.getMockTestHistories.queryOptions({
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
	const cardStyle = useCardStyle();

	return (
		<AppContent
			header={
				<AppHeader
					title="Lịch sử luyện thi"
					description="Xem lại các lần làm đề thi thử trước đây để theo dõi điểm số và tiến độ của bạn."
				/>
			}
		>
			<div className="space-y-6">
				{histories.items.length === 0 && (
					<div className={cardStyle}>
						<p className="text-neutral-500 text-sm">
							Bạn chưa có lịch sử luyện thi nào. Hãy bắt đầu một đề thi để xem
							lịch sử tại đây.
						</p>
					</div>
				)}

				<MockTestHistoryDataTable histories={histories} />
			</div>
		</AppContent>
	);
}
