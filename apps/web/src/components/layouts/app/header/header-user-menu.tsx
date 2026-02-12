"use client";

import { SignOutIcon } from "@phosphor-icons/react";
import { useRouteContext } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export function HeaderUserMenu() {
	const { user } = useRouteContext({
		strict: false,
	});

	const handleLogout = async () => {
		await authClient.signOut();
		window.location.href = "/login";
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative size-10 rounded-full p-0 hover:bg-accent"
				>
					<Avatar className="size-9 rounded-full">
						<AvatarImage
							src={user?.user.image as string}
							alt={user?.user.name || "User Avatar"}
						/>
						<AvatarFallback className="rounded-full">
							{user?.user.name?.charAt(0) || "U"}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="font-medium text-sm leading-none">
							{user?.user.name || "No Name"}
						</p>
						<p className="text-muted-foreground text-xs leading-none">
							{user?.user.email || "No Email"}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					<SignOutIcon className="mr-2 size-4" />
					<span>Đăng xuất</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
