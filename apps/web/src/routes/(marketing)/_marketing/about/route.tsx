import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(marketing)/_marketing/about")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(marketing)/_marketing/about"!</div>;
}
