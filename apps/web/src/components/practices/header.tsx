import { CaretLeftIcon } from "@phosphor-icons/react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type Props = {
	title: string;
	timer?: ReactNode;
	action?: ReactNode;
	className?: string;
};

export const Header = ({ title, action, timer, className }: Props) => {
	const isCanGoBack = useCanGoBack();
	const router = useRouter();

	const handleGoBack = () => {
		if (isCanGoBack) {
			return router.history.back();
		}

		return router.navigate({
			to: "/app",
		});
	};

	return (
		<header
			className={cn(
				"relative z-20 flex h-16 shrink-0 items-center justify-between border-border border-b bg-white px-4",
				className,
			)}
		>
			<div className="flex items-center gap-4">
				<Button size="icon-sm" variant="outline" onClick={handleGoBack}>
					<span className="sr-only">Trở lại</span>
					<CaretLeftIcon />
				</Button>
				<Logo />
				<Separator orientation="vertical" className="!h-4" />
				<span className="hidden font-medium text-primary text-sm sm:block">
					{title}
				</span>
			</div>
			{timer}
			{action}
		</header>
	);
};
