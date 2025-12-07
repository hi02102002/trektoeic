import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
	beforeLoad({ context }) {
		if (!context.user) {
			throw redirect({
				to: "/login",
			});
		}

		return {
			user: context.user,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_protected"!</div>;
}
