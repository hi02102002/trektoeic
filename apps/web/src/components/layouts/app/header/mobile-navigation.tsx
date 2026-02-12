"use client";

import { ListIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const dashboardRoutes = [
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
] as const;

export function MobileNavigation() {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon">
					<ListIcon className="size-5" weight="bold" />
					<span className="sr-only">Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-72">
				<SheetHeader>
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<Logo />
				</SheetHeader>
				<nav className="flex flex-col gap-1 px-4">
					{dashboardRoutes.map((route) => (
						<Link
							key={route.id}
							to={route.link}
							onClick={() => setOpen(false)}
							activeOptions={{ exact: route.link === "/app" }}
							className={cn(
								"rounded-md px-3 py-2 font-medium text-sm transition-colors hover:bg-accent",
								"data-[status=active]:bg-accent data-[status=active]:text-accent-foreground",
							)}
						>
							{route.title}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
