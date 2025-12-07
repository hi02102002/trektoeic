import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
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
