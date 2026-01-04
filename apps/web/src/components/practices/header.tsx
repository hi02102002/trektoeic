import { CaretLeftIcon, ListBulletsIcon } from "@phosphor-icons/react";
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
	onNavigatorToggle?: () => void;
};

export const Header = ({
	title,
	action,
	timer,
	className,
	onNavigatorToggle,
}: Props) => {
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
				"relative z-20 flex h-16 shrink-0 items-center justify-between border-border border-b bg-white px-2 sm:px-4",
				className,
			)}
		>
			<div className="flex items-center gap-2 sm:gap-4">
				<Button size="icon" variant="outline" onClick={handleGoBack}>
					<span className="sr-only">Trở lại</span>
					<CaretLeftIcon />
				</Button>
				{onNavigatorToggle && (
					<Button
						size="icon"
						variant="outline"
						onClick={onNavigatorToggle}
						className="xl:hidden"
					>
						<span className="sr-only">Mở danh sách câu hỏi</span>
						<ListBulletsIcon />
					</Button>
				)}
				<Logo className="xs:block hidden sm:block" />
				<Separator orientation="vertical" className="!h-4 hidden sm:block" />
				<span className="hidden font-medium text-primary text-sm sm:block">
					{title}
				</span>
			</div>
			{timer}
			<div className="flex items-center">{action}</div>
		</header>
	);
};
