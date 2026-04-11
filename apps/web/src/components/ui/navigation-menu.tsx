import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

function getRenderElement(children: React.ReactNode) {
	return React.isValidElement(children)
		? (children as React.ReactElement)
		: undefined;
}

function NavigationMenu({
	className,
	children,
	viewport = true,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
	viewport?: boolean;
}) {
	return (
		<NavigationMenuPrimitive.Root
			data-slot="navigation-menu"
			data-viewport={viewport}
			className={cn(
				"group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
				className,
			)}
			{...props}
		>
			{children}
			{viewport && (
				<NavigationMenuPrimitive.Portal>
					<NavigationMenuPrimitive.Positioner className="absolute top-full left-0 isolate z-50 flex justify-center">
						<NavigationMenuPrimitive.Popup className="data-open:zoom-in-90 data-closed:zoom-out-90 relative mt-1.5 origin-(--transform-origin) overflow-hidden rounded-none bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in">
							<NavigationMenuViewport />
						</NavigationMenuPrimitive.Popup>
					</NavigationMenuPrimitive.Positioner>
				</NavigationMenuPrimitive.Portal>
			)}
		</NavigationMenuPrimitive.Root>
	);
}

function NavigationMenuList({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
	return (
		<NavigationMenuPrimitive.List
			data-slot="navigation-menu-list"
			className={cn(
				"group flex flex-1 list-none items-center justify-center gap-0",
				className,
			)}
			{...props}
		/>
	);
}

function NavigationMenuItem({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
	return (
		<NavigationMenuPrimitive.Item
			data-slot="navigation-menu-item"
			className={cn("relative", className)}
			{...props}
		/>
	);
}

const navigationMenuTriggerStyle = cva(
	"group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-none px-2.5 py-1.5 font-medium text-xs outline-none transition-all hover:bg-muted focus:bg-muted focus-visible:outline-1 focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted",
);

function NavigationMenuTrigger({
	className,
	children,
	asChild,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> & {
	asChild?: boolean;
}) {
	if (asChild) {
		const render = getRenderElement(children);

		if (render) {
			return (
				<NavigationMenuPrimitive.Trigger
					data-slot="navigation-menu-trigger"
					className={cn(navigationMenuTriggerStyle(), "group", className)}
					render={render}
					{...props}
				/>
			);
		}
	}

	return (
		<NavigationMenuPrimitive.Trigger
			data-slot="navigation-menu-trigger"
			className={cn(navigationMenuTriggerStyle(), "group", className)}
			{...props}
		>
			{children}
			<NavigationMenuPrimitive.Icon className="relative top-px ml-1 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180">
				<CaretDownIcon className="size-3" aria-hidden="true" />
			</NavigationMenuPrimitive.Icon>
		</NavigationMenuPrimitive.Trigger>
	);
}

function NavigationMenuContent({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
	return (
		<NavigationMenuPrimitive.Content
			data-slot="navigation-menu-content"
			className={cn(
				"data-open:fade-in-0 data-closed:fade-out-0 data-[activation-direction=right]:slide-in-from-right-52 data-[activation-direction=left]:slide-in-from-left-52 top-0 left-0 w-full p-1 ease-[cubic-bezier(0.22,1,0.36,1)] data-closed:animate-out data-open:animate-in **:data-[slot=navigation-menu-link]:focus:outline-none **:data-[slot=navigation-menu-link]:focus:ring-0 md:w-auto",
				className,
			)}
			{...props}
		/>
	);
}

function NavigationMenuViewport({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
	return (
		<NavigationMenuPrimitive.Viewport
			data-slot="navigation-menu-viewport"
			className={cn(
				"h-full max-h-(--available-height) w-full md:w-(--positioner-width)",
				className,
			)}
			{...props}
		/>
	);
}

function NavigationMenuLink({
	className,
	children,
	asChild,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link> & {
	asChild?: boolean;
}) {
	if (asChild) {
		const render = getRenderElement(children);

		if (render) {
			return (
				<NavigationMenuPrimitive.Link
					data-slot="navigation-menu-link"
					className={cn(
						"flex items-center gap-2 in-data-[slot=navigation-menu-content]:rounded-none rounded-none p-2 text-xs outline-none transition-all hover:bg-muted focus:bg-muted focus-visible:outline-1 focus-visible:ring-1 focus-visible:ring-ring/50 data-active:bg-muted/50 data-active:focus:bg-muted data-active:hover:bg-muted [&_svg:not([class*='size-'])]:size-4",
						className,
					)}
					render={render}
					{...props}
				/>
			);
		}
	}

	return (
		<NavigationMenuPrimitive.Link
			data-slot="navigation-menu-link"
			className={cn(
				"flex items-center gap-2 in-data-[slot=navigation-menu-content]:rounded-none rounded-none p-2 text-xs outline-none transition-all hover:bg-muted focus:bg-muted focus-visible:outline-1 focus-visible:ring-1 focus-visible:ring-ring/50 data-active:bg-muted/50 data-active:focus:bg-muted data-active:hover:bg-muted [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			{children}
		</NavigationMenuPrimitive.Link>
	);
}

function NavigationMenuIndicator({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Arrow>) {
	return (
		<NavigationMenuPrimitive.Arrow
			data-slot="navigation-menu-indicator"
			className={cn("z-1 flex size-3 items-center justify-center", className)}
			{...props}
		>
			<div className="size-2 rotate-45 rounded-none bg-border shadow-md" />
		</NavigationMenuPrimitive.Arrow>
	);
}

export {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
};
