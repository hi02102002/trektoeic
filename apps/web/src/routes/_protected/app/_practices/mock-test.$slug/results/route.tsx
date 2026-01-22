import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_protected/app/_practices/mock-test/$slug/results",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_protected/app/_practices/mock-test/$slug/results"!</div>;
}
