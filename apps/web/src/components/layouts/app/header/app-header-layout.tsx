import { Logo } from "@/components/logo";
import { HeaderNavigation } from "./header-navigation";
import { HeaderUserMenu } from "./header-user-menu";
import { MobileNavigation } from "./mobile-navigation";

export function AppHeaderLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen w-full flex-col">
			<header className="fixed top-0 z-50 w-full border-border border-b bg-background/80 backdrop-blur-md">
				<div className="container mx-auto px-4">
					<div className="flex h-14 items-center justify-between gap-4">
						<div className="flex items-center gap-2">
							<div className="md:hidden">
								<MobileNavigation />
							</div>
							<Logo />
						</div>
						<div className="hidden md:flex">
							<HeaderNavigation />
						</div>
						<HeaderUserMenu />
					</div>
				</div>
			</header>
			<main className="container mx-auto mt-14 flex-1 p-6">{children}</main>
		</div>
	);
}
