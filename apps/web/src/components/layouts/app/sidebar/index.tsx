import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./app-sidebar";

export function Sidebar({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<div className="relative flex min-h-screen w-full">
				<DashboardSidebar />
				<SidebarInset className="p-6">{children}</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
