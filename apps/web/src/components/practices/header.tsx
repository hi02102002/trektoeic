import type { ReactNode } from "react";
import { Logo } from "../logo";
import { Separator } from "../ui/separator";

type Props = {
	title: string;
	timer?: ReactNode;
	action?: ReactNode;
};

export const Header = ({ title, action, timer }: Props) => {
	return (
		<header className="relative z-20 flex h-16 shrink-0 items-center justify-between border-border border-b bg-white px-4">
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
