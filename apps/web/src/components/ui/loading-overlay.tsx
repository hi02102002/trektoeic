import { Portal } from "@radix-ui/react-portal";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const loadingOverlayVariants = cva(
	"fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm",
	{
		variants: {
			variant: {
				default: "z-50",
				high: "z-[100]",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface LoadingOverlayProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof loadingOverlayVariants> {
	open?: boolean;
	message?: string;
	spinnerClassName?: string;
}

const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
	(
		{
			className,
			variant,
			open = false,
			message,
			spinnerClassName,
			children,
			...props
		},
		ref,
	) => {
		if (!open) return null;

		return (
			<Portal>
				<div
					ref={ref}
					className={cn(loadingOverlayVariants({ variant }), className)}
					{...props}
				>
					{children || (
						<div className="flex flex-col items-center gap-3">
							<Spinner className={cn("size-8", spinnerClassName)} />
							{message && (
								<p className="text-muted-foreground text-sm">{message}</p>
							)}
						</div>
					)}
				</div>
			</Portal>
		);
	},
);
LoadingOverlay.displayName = "LoadingOverlay";

export { LoadingOverlay, loadingOverlayVariants };
