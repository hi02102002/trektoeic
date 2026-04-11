import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Header = () => {
	return (
		<header className="fixed top-0 z-50 w-full border-border border-b bg-background/80 backdrop-blur-md">
			<div className="container mx-auto px-4">
				<div className="flex h-14 items-center justify-between gap-4">
					<Link to="/" className="inline-block">
						<Logo />
					</Link>
					<div className="flex items-center gap-2 sm:gap-3">
						<Link
							to="/about-us"
							className={buttonVariants({ variant: "ghost" })}
						>
							Giới thiệu
						</Link>
						<Link to="/login" className={cn(buttonVariants())}>
							Bắt đầu ngay
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
};
