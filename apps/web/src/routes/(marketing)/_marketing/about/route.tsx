import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(marketing)/_marketing/about")({
	beforeLoad: () => {
		throw redirect({
			to: "/about-us",
			replace: true,
		});
	},
});
