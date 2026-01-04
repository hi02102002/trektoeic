import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type LogoProps = ComponentProps<"div"> & {
	classNames?: {
		container?: string;
		icon?: string;
	};
	isShowText?: boolean;
};

export const Logo = ({
	className,
	classNames,
	isShowText = true,
}: LogoProps) => {
	return (
		<div
			className={cn(
				"flex items-center gap-2 font-semibold text-lg text-primary uppercase",
				classNames?.container,
				className,
			)}
		>
			{!isShowText && (
				<div
					className={cn(
						"flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground",
						classNames?.icon,
					)}
				>
					<span className="font-bold text-base">T</span>
				</div>
			)}
			{isShowText && (
				<span>
					<span>Trek</span>
					<span className="text-muted-foreground">Toeic</span>
				</span>
			)}
		</div>
	);
};
