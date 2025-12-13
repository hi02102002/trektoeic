import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_protected/app/_dashboard/")({
	loader: async ({ context }) => {
		const data = await context.queryClient.ensureQueryData(
			context.orpc.healthCheck.queryOptions(),
		);

		return data;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = useSuspenseQuery(orpc.healthCheck.queryOptions());

	return <div>{data}</div>;
}
