import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_protected/app/_practices/practices/$part/$session-id/results/summary",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			Hello
			"/_protected/app/_practices/practices/$part/$session-id/results/summary"!
		</div>
	);
}
