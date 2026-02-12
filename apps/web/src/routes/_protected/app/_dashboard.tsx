import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppHeaderLayout } from "@/components/layouts/app/header";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export const Route = createFileRoute("/_protected/app/_dashboard")({
	component: RouteComponent,
	pendingComponent: () => <LoadingOverlay open message="Đang tải..." />,
});

function RouteComponent() {
	return (
		<AppHeaderLayout>
			<Outlet />
		</AppHeaderLayout>
	);
}
