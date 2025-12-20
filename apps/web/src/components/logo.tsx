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
				"flex items-start gap-1 font-semibold text-lg text-primary uppercase",
				classNames?.container,
				className,
			)}
		>
			{isShowText && (
				<span>
					<span>Trek</span>
					<span className="text-muted-foreground">Toeic</span>
				</span>
			)}
		</div>
	);
};
