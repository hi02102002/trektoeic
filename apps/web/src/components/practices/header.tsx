import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";
import { Separator } from "../ui/separator";

type Props = {
	title: string;
	timer?: ReactNode;
	action?: ReactNode;
	className?: string;
};

export const Header = ({ title, action, timer, className }: Props) => {
	return (
		<header
			className={cn(
				"relative z-20 flex h-16 shrink-0 items-center justify-between border-border border-b bg-white px-4",
				className,
			)}
		>
			<div className="flex items-center gap-4">
				<Logo />
				<Separator orientation="vertical" className="h-4" />
				<span className="hidden font-medium text-primary text-sm sm:block">
					{title}
				</span>
			</div>
			{timer}
			{action}
		</header>
	);
};
