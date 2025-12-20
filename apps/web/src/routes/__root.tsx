import type { QueryClient } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Analytics } from "@vercel/analytics/react";
import { NProgress } from "@/components/nprogress";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/functions/get-user";
import type { orpc } from "@/utils/orpc";
import appCss from "../index.css?url";

export interface RouterAppContext {
	orpc: typeof orpc;
	queryClient: QueryClient;
	user: Awaited<ReturnType<typeof getUser>>;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "My App",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: "https://unpkg.com/nprogress@0.2.0/nprogress.css",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	async beforeLoad({ context }) {
		const user = await context.queryClient.ensureQueryData({
			queryKey: ["current-user"],
			queryFn: async () => {
				return getUser();
			},
		});

		return {
			user,
		};
	},
	component: RootDocument,
});

function RootDocument() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<NProgress />
				<Outlet />
				<Toaster position="top-center" />
				<TanStackRouterDevtools position="bottom-left" />
				<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
				<Scripts />
			</body>
			<Analytics />
		</html>
	);
}
