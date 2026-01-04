import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
	"inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2 has-[>svg]:px-3",
				sm: "h-9 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
				lg: "h-11 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-md": "size-9",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		loading?: boolean;
		loadingText?: string;
		leadingIcon?: React.ReactNode;
		trailingIcon?: React.ReactNode;
		classNames?: {
			button?: string;
			icon?: string;
			spinner?: string;
		};
		ref?: React.Ref<HTMLButtonElement>;
	};

function Button({
	className,
	variant,
	size,
	asChild = false,
	loading = false,
	disabled,
	loadingText,
	leadingIcon,
	trailingIcon,
	children,
	classNames,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button";
	const isDisabled = disabled || loading;

	return (
		<Comp
			data-slot="button"
			disabled={isDisabled}
			aria-busy={loading}
			className={cn(
				buttonVariants({
					variant,
					size,
					className: cn(className, classNames?.button),
				}),
			)}
			{...props}
		>
			{loading ? (
				<>
					<Spinner
						className={cn("size-4", classNames?.icon, classNames?.spinner)}
					/>
					{loadingText || children}
				</>
			) : (
				<>
					{leadingIcon && (
						<span className={cn(classNames?.icon)}>{leadingIcon}</span>
					)}
					{children}
					{trailingIcon && (
						<span className={cn(classNames?.icon)}>{trailingIcon}</span>
					)}
				</>
			)}
		</Comp>
	);
}

Button.displayName = "Button";

export { Button, buttonVariants };
