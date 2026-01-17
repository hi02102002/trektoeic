"use client";

import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { Link, type LinkProps } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuItem as SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type Route = {
	id: string;
	title: string;
	icon?: React.ReactNode;
	link: LinkProps["to"];
	subs?: {
		title: string;
		link: string;
		icon?: React.ReactNode;
	}[];
};

export default function DashboardNavigation({ routes }: { routes: Route[] }) {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";
	const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

	return (
		<SidebarMenu>
			{routes.map((route) => {
				const isOpen = !isCollapsed && openCollapsible === route.id;
				const hasSubRoutes = !!route.subs?.length;

				return (
					<SidebarMenuItem key={route.id}>
						{hasSubRoutes ? (
							<Collapsible
								open={isOpen}
								onOpenChange={(open) =>
									setOpenCollapsible(open ? route.id : null)
								}
								className="w-full"
							>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton
										className={cn(
											"flex w-full items-center rounded-lg px-2 transition-colors",
											isOpen
												? "bg-sidebar-muted text-foreground"
												: "text-muted-foreground hover:bg-sidebar-muted hover:text-foreground",
											isCollapsed && "justify-center",
										)}
									>
										{route.icon}
										{!isCollapsed && (
											<span className="ml-2 flex-1 font-medium text-sm">
												{route.title}
											</span>
										)}
										{!isCollapsed && hasSubRoutes && (
											<span className="ml-auto">
												{isOpen ? (
													<CaretUp className="size-4" />
												) : (
													<CaretDown className="size-4" />
												)}
											</span>
										)}
									</SidebarMenuButton>
								</CollapsibleTrigger>

								{!isCollapsed && (
									<CollapsibleContent>
										<SidebarMenuSub className="my-1 ml-3.5">
											{route.subs?.map((subRoute) => (
												<SidebarMenuSubItem
													key={`${route.id}-${subRoute.title}`}
													className="h-auto"
												>
													<SidebarMenuSubButton asChild>
														<Link
															to={subRoute.link}
															className={cn(
																"flex items-center rounded-md px-4 py-1.5 font-medium text-muted-foreground text-sm hover:bg-sidebar-muted hover:text-foreground",
																"data-[status=active]:bg-sidebar-accent data-[status=active]:text-foreground",
															)}
															activeOptions={{
																includeSearch: true,
																includeHash: true,
																exact: true,
															}}
														>
															{subRoute.title}
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								)}
							</Collapsible>
						) : (
							<SidebarMenuButton tooltip={route.title} asChild>
								<Link
									to={route.link}
									className={cn(
										"flex items-center rounded-lg border border-transparent px-2 text-muted-foreground transition-colors hover:bg-sidebar-muted hover:text-foreground",
										isCollapsed && "justify-center",
										"data-[status=active]:border-border data-[status=active]:bg-sidebar-accent data-[status=active]:text-foreground",
									)}
									activeOptions={{
										exact: true,
									}}
								>
									{route.icon}
									{!isCollapsed && (
										<span className="font-medium text-sm">{route.title}</span>
									)}
								</Link>
							</SidebarMenuButton>
						)}
					</SidebarMenuItem>
				);
			})}
		</SidebarMenu>
	);
}
