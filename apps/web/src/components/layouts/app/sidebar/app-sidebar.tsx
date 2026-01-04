"use client";

import {
	AppWindowIcon,
	CheckerboardIcon,
	ExamIcon,
	NotepadIcon,
	ReadCvLogoIcon,
} from "@phosphor-icons/react";
import { Logo } from "@/components/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { Route } from "./nav-main";
import DashboardNavigation from "./nav-main";
import { NavUser } from "./nav-user";

const dashboardRoutes: Route[] = [
	{
		id: "home",
		title: "Trang chủ",
		icon: <AppWindowIcon weight="duotone" />,
		link: "/app",
	},
	{
		id: "practices",
		title: "Luyện tập",
		icon: <ReadCvLogoIcon weight="duotone" />,
		link: "/app/practices",
	},
	{
		id: "vocabularies",
		title: "Từ vựng",
		icon: <NotepadIcon weight="duotone" />,
		link: "/app/vocabularies",
	},
	{
		id: "grammar",
		title: "Ngữ pháp",
		icon: <CheckerboardIcon weight="duotone" />,
		link: "/app/grammar",
	},
	{
		id: "mock-tests",
		title: "Luyện thi",
		icon: <ExamIcon weight="duotone" />,
		link: "/app/mock-test",
	},
];

export function DashboardSidebar() {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<Sidebar variant="sidebar" collapsible="icon">
			<SidebarHeader
				className={cn(
					"flex",
					isCollapsed
						? "flex-row items-center justify-center gap-y-4 md:flex-col md:items-center md:justify-center"
						: "flex-row items-center justify-between",
				)}
			>
				<Logo isShowText={!isCollapsed} />
			</SidebarHeader>
			<SidebarContent className="gap-4 px-2 py-4">
				<DashboardNavigation routes={dashboardRoutes} />
			</SidebarContent>
			<SidebarFooter className="px-2">
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
