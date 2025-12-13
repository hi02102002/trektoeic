import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/app/_dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
