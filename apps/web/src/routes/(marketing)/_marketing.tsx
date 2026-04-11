import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Footer, Header } from "@/components/layouts/marketing";

export const Route = createFileRoute("/(marketing)/_marketing")({
	component: RouteComponent,
	headers: () => ({
		"Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
		"CDN-Cache-Control": "max-age=86400",
	}),
	staleTime: 60 * 60_000, // 1 hour
});

function RouteComponent() {
	return (
		<div className="min-h-screen bg-neutral-50 text-foreground">
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
}
