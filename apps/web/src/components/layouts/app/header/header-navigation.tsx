"use client";

import { Link, type LinkProps } from "@tanstack/react-router";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export type Route = {
	id: string;
	title: string;
	link: LinkProps["to"];
	subs?: {
		title: string;
		link: string;
	}[];
};

const dashboardRoutes: Route[] = [
	{
		id: "home",
		title: "Trang chủ",
		link: "/app",
	},
	{
		id: "practices",
		title: "Luyện tập",
		link: "/app/practices",
	},
	{
		id: "vocabularies",
		title: "Từ vựng",
		link: "/app/vocabularies",
	},
	{
		id: "grammar",
		title: "Ngữ pháp",
		link: "/app/grammar",
	},
	{
		id: "mock-tests",
		title: "Luyện thi",
		link: "/app/mock-test",
	},
];

export function HeaderNavigation() {
	return (
		<nav>
			<NavigationMenu>
				<NavigationMenuList className="gap-2">
					{dashboardRoutes.map((route) => {
						const hasSubRoutes = !!route.subs?.length;

						return (
							<NavigationMenuItem key={route.id}>
								{hasSubRoutes ? (
									<>
										<NavigationMenuTrigger className="bg-transparent hover:bg-accent">
											<span className="font-medium text-sm">{route.title}</span>
										</NavigationMenuTrigger>
										<NavigationMenuContent>
											<ul className="grid w-[200px] gap-1 p-2">
												{route.subs?.map((subRoute) => (
													<li key={`${route.id}-${subRoute.title}`}>
														<NavigationMenuLink asChild>
															<Link
																to={subRoute.link}
																className={cn(
																	"flex items-center rounded-md px-3 py-2 font-medium text-sm transition-colors hover:bg-accent",
																	"data-[status=active]:bg-accent data-[status=active]:text-accent-foreground",
																)}
																activeOptions={{
																	includeSearch: true,
																}}
															>
																{subRoute.title}
															</Link>
														</NavigationMenuLink>
													</li>
												))}
											</ul>
										</NavigationMenuContent>
									</>
								) : (
									<NavigationMenuLink asChild>
										<Link
											to={route.link}
											className={cn(
												"flex items-center rounded-md px-3 py-2 font-medium text-sm transition-colors hover:bg-accent",
												"data-[status=active]:bg-accent data-[status=active]:text-accent-foreground",
											)}
											activeOptions={{
												exact: route.link === "/app",
											}}
										>
											{route.title}
										</Link>
									</NavigationMenuLink>
								)}
							</NavigationMenuItem>
						);
					})}
				</NavigationMenuList>
			</NavigationMenu>
		</nav>
	);
}
