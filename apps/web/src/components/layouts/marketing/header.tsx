import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";

export const Header = () => {
	return (
		<header className="fixed top-0 z-50 w-full border-neutral-200/50 border-b bg-white/80 backdrop-blur-md">
			<nav className="container mx-auto">
				<div className="flex h-16 items-center justify-between">
					<Link to="/" className="inline-block">
						<Logo />
					</Link>
					<div className="hidden items-center gap-8 font-medium text-neutral-500 text-sm md:flex">
						<a
							href="#method"
							className="transition-colors hover:text-neutral-900"
						>
							Methodology
						</a>
						<a
							href="#parts"
							className="transition-colors hover:text-neutral-900"
						>
							Exam Parts
						</a>
						<a
							href="#success"
							className="transition-colors hover:text-neutral-900"
						>
							Success Stories
						</a>
					</div>
					<div className="flex items-center gap-4">
						<Link to="/login" className={buttonVariants()}>
							Bắt đầu ngay
						</Link>
					</div>
				</div>
			</nav>
		</header>
	);
};
