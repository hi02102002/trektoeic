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
import { useMount } from "ahooks";
import { scan } from "react-scan";
import { NProgress } from "@/components/nprogress";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/functions/get-user";
import { generateMetadata } from "@/lib/meta";
import type { orpc } from "@/lib/orpc/orpc";
import appCss from "../index.css?url";

export interface RouterAppContext {
	orpc: typeof orpc;
	queryClient: QueryClient;
	user: Awaited<ReturnType<typeof getUser>>;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => {
		const { meta, links: metaLinks } = generateMetadata({
			charSet: "utf-8",
			title: "TrekToeic",
			description:
				"Nền tảng học TOEIC trực tuyến, giúp bạn luyện tập hiệu quả và đạt điểm cao. Luyện tập theo từng phần, làm đề thi thử, học từ vựng và ngữ pháp.",
			keywords: [
				"TOEIC",
				"học TOEIC",
				"luyện thi TOEIC",
				"TOEIC online",
				"luyện TOEIC trực tuyến",
				"đề thi TOEIC",
				"từ vựng TOEIC",
				"ngữ pháp TOEIC",
			],
			viewport: {
				width: "device-width",
				initialScale: 1,
			},
			openGraph: {
				type: "website",
				title: "TrekToeic - Chinh phục TOEIC hiệu quả",
				description:
					"Nền tảng học TOEIC trực tuyến, giúp bạn luyện tập hiệu quả và đạt điểm cao.",
				siteName: "TrekToeic",
			},
			twitter: {
				card: "summary_large_image",
				title: "TrekToeic - Chinh phục TOEIC hiệu quả",
				description:
					"Nền tảng học TOEIC trực tuyến, giúp bạn luyện tập hiệu quả và đạt điểm cao.",
			},
		});

		return {
			meta,
			links: [
				...metaLinks,
				{
					rel: "icon",
					type: "image/x-icon",
					href: "/favicon.ico",
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "16x16",
					href: "/favicon-16x16.png",
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "32x32",
					href: "/favicon-32x32.png",
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "192x192",
					href: "/favicon-192x192.png",
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "512x512",
					href: "/favicon-512x512.png",
				},
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/apple-touch-icon.png",
				},
				{
					rel: "stylesheet",
					href: "https://unpkg.com/nprogress@0.2.0/nprogress.css",
				},
				{
					rel: "stylesheet",
					href: appCss,
				},
			],
			scripts: [
				{
					async: true,
					src: "https://www.googletagmanager.com/gtag/js?id=G-11Z12V1WLY",
				},
				{
					id: "google-analytics",
					src: "/google-analytics.js",
				},
			],
		};
	},
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
	useMount(() => {
		if (import.meta.env.DEV) {
			scan({
				enabled: true,
			});
		}
	});

	return (
		<html lang="vi">
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
