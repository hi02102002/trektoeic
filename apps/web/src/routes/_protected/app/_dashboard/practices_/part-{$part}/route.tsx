import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/practices_/part-{$part}",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_protected/app/_dashboard/_practices/part-$part"!</div>;
}
