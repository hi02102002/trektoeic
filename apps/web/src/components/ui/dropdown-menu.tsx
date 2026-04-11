import { Menu as DropdownMenuPrimitive } from "@base-ui/react/menu";
import { CaretRightIcon, CheckIcon } from "@phosphor-icons/react";
import * as React from "react";

import { cn } from "@/lib/utils";

function getRenderElement(children: React.ReactNode) {
	return React.isValidElement(children)
		? (children as React.ReactElement)
		: undefined;
}

function DropdownMenu({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
	return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
	return (
		<DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
	);
}

function DropdownMenuTrigger({
	asChild,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger> & {
	asChild?: boolean;
}) {
	if (asChild) {
		const render = getRenderElement(children);

		if (render) {
			return (
				<DropdownMenuPrimitive.Trigger
					data-slot="dropdown-menu-trigger"
					render={render}
					{...props}
				/>
			);
		}
	}

	return (
		<DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props}>
			{children}
		</DropdownMenuPrimitive.Trigger>
	);
}

function DropdownMenuContent({
	className,
	align = "start",
	sideOffset = 4,
	side,
	forceMount,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Popup> &
	Pick<
		React.ComponentProps<typeof DropdownMenuPrimitive.Positioner>,
		"align" | "side" | "sideOffset"
	> & {
		forceMount?: boolean;
	}) {
	return (
		<DropdownMenuPrimitive.Portal keepMounted={forceMount}>
			<DropdownMenuPrimitive.Positioner
				align={align}
				side={side}
				sideOffset={sideOffset}
			>
				<DropdownMenuPrimitive.Popup
					data-slot="dropdown-menu-content"
					className={cn(
						"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 relative z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) animate-none! overflow-y-auto overflow-x-hidden rounded-none bg-popover/70 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 data-closed:animate-out data-open:animate-in **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-trigger]:data-popup-open:bg-foreground/10! **:data-[slot$=-separator]:bg-foreground/5 **:data-[variant=destructive]:**:text-accent-foreground! **:data-[variant=destructive]:text-accent-foreground! **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[variant=destructive]:focus:bg-foreground/10!",
						className,
					)}
					{...props}
				/>
			</DropdownMenuPrimitive.Positioner>
		</DropdownMenuPrimitive.Portal>
	);
}

function DropdownMenuGroup({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
	return (
		<DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
	);
}

function DropdownMenuItem({
	className,
	inset,
	variant = "default",
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
	inset?: boolean;
	variant?: "default" | "destructive";
}) {
	return (
		<DropdownMenuPrimitive.Item
			data-slot="dropdown-menu-item"
			data-inset={inset}
			data-variant={variant}
			className={cn(
				"group/dropdown-menu-item relative flex cursor-default select-none items-center gap-2 rounded-none px-2 py-2 text-xs outline-hidden focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-7 data-[variant=destructive]:text-destructive data-disabled:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[variant=destructive]:*:[svg]:text-destructive",
				className,
			)}
			{...props}
		/>
	);
}

function DropdownMenuCheckboxItem({
	className,
	children,
	inset,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
	inset?: boolean;
}) {
	return (
		<DropdownMenuPrimitive.CheckboxItem
			data-slot="dropdown-menu-checkbox-item"
			data-inset={inset}
			className={cn(
				"relative flex cursor-default select-none items-center gap-2 rounded-none py-2 pr-8 pl-2 text-xs outline-hidden focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-7 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			{...props}
		>
			<span
				className="pointer-events-none absolute right-2 flex items-center justify-center"
				data-slot="dropdown-menu-checkbox-item-indicator"
			>
				<DropdownMenuPrimitive.CheckboxItemIndicator keepMounted>
					<CheckIcon />
				</DropdownMenuPrimitive.CheckboxItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.CheckboxItem>
	);
}

function DropdownMenuRadioGroup({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
	return (
		<DropdownMenuPrimitive.RadioGroup
			data-slot="dropdown-menu-radio-group"
			{...props}
		/>
	);
}

function DropdownMenuRadioItem({
	className,
	children,
	inset,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
	inset?: boolean;
}) {
	return (
		<DropdownMenuPrimitive.RadioItem
			data-slot="dropdown-menu-radio-item"
			data-inset={inset}
			className={cn(
				"relative flex cursor-default select-none items-center gap-2 rounded-none py-2 pr-8 pl-2 text-xs outline-hidden focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-7 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			{...props}
		>
			<span
				className="pointer-events-none absolute right-2 flex items-center justify-center"
				data-slot="dropdown-menu-radio-item-indicator"
			>
				<DropdownMenuPrimitive.RadioItemIndicator keepMounted>
					<CheckIcon />
				</DropdownMenuPrimitive.RadioItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.RadioItem>
	);
}

function DropdownMenuLabel({
	className,
	inset,
	...props
}: React.ComponentProps<"div"> & {
	inset?: boolean;
}) {
	return (
		<div
			data-slot="dropdown-menu-label"
			data-inset={inset}
			className={cn(
				"px-2 py-2 text-muted-foreground text-xs data-inset:pl-7",
				className,
			)}
			{...props}
		/>
	);
}

function DropdownMenuSeparator({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
	return (
		<DropdownMenuPrimitive.Separator
			data-slot="dropdown-menu-separator"
			className={cn("-mx-1 h-px bg-border", className)}
			{...props}
		/>
	);
}

function DropdownMenuShortcut({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="dropdown-menu-shortcut"
			className={cn(
				"ml-auto text-muted-foreground text-xs tracking-widest group-focus/dropdown-menu-item:text-accent-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function DropdownMenuSub({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubmenuRoot>) {
	return (
		<DropdownMenuPrimitive.SubmenuRoot
			data-slot="dropdown-menu-sub"
			{...props}
		/>
	);
}

function DropdownMenuSubTrigger({
	className,
	inset,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubmenuTrigger> & {
	inset?: boolean;
}) {
	return (
		<DropdownMenuPrimitive.SubmenuTrigger
			data-slot="dropdown-menu-sub-trigger"
			data-inset={inset}
			className={cn(
				"flex cursor-default select-none items-center gap-2 rounded-none px-2 py-2 text-xs outline-hidden focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-popup-open:bg-accent data-inset:pl-7 data-popup-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			{...props}
		>
			{children}
			<CaretRightIcon className="ml-auto" />
		</DropdownMenuPrimitive.SubmenuTrigger>
	);
}

function DropdownMenuSubContent({
	className,
	align = "start",
	sideOffset = 4,
	side,
	forceMount,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Popup> &
	Pick<
		React.ComponentProps<typeof DropdownMenuPrimitive.Positioner>,
		"align" | "side" | "sideOffset"
	> & {
		forceMount?: boolean;
	}) {
	return (
		<DropdownMenuPrimitive.Portal keepMounted={forceMount}>
			<DropdownMenuPrimitive.Positioner
				align={align}
				side={side}
				sideOffset={sideOffset}
			>
				<DropdownMenuPrimitive.Popup
					data-slot="dropdown-menu-sub-content"
					className={cn(
						"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 relative z-50 min-w-[96px] origin-(--transform-origin) animate-none! overflow-hidden rounded-none bg-popover/70 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 data-closed:animate-out data-open:animate-in **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-trigger]:data-popup-open:bg-foreground/10! **:data-[slot$=-separator]:bg-foreground/5 **:data-[variant=destructive]:**:text-accent-foreground! **:data-[variant=destructive]:text-accent-foreground! **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[variant=destructive]:focus:bg-foreground/10!",
						className,
					)}
					{...props}
				/>
			</DropdownMenuPrimitive.Positioner>
		</DropdownMenuPrimitive.Portal>
	);
}

export {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
};
