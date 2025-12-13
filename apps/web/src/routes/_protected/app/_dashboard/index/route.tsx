import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_protected/app/_dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = useSuspenseQuery(
		orpc.practices.getByPart.queryOptions({
			input: {
				part: 1,
				limit: 5,
			},
		}),
	);

	return <div>{JSON.stringify(data, null, 2)}</div>;
}
