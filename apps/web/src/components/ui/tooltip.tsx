import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

function getRenderElement(children: React.ReactNode) {
	return React.isValidElement(children)
		? (children as React.ReactElement)
		: undefined;
}

function TooltipProvider({
	delay,
	delayDuration = 0,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider> & {
	delayDuration?: number;
}) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delay={delay ?? delayDuration}
			{...props}
		/>
	);
}

function Tooltip({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({
	asChild,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger> & {
	asChild?: boolean;
}) {
	if (asChild) {
		const render = getRenderElement(children);

		if (render) {
			return (
				<TooltipPrimitive.Trigger
					data-slot="tooltip-trigger"
					render={render}
					{...props}
				/>
			);
		}
	}

	return (
		<TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props}>
			{children}
		</TooltipPrimitive.Trigger>
	);
}

function TooltipContent({
	className,
	align = "center",
	forceMount,
	side,
	sideOffset = 0,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> &
	Pick<
		React.ComponentProps<typeof TooltipPrimitive.Positioner>,
		"align" | "side" | "sideOffset"
	> & {
		forceMount?: boolean;
	}) {
	return (
		<TooltipPrimitive.Portal keepMounted={forceMount}>
			<TooltipPrimitive.Positioner
				align={align}
				side={side}
				sideOffset={sideOffset}
			>
				<TooltipPrimitive.Popup
					data-slot="tooltip-content"
					className={cn(
						"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-none bg-foreground px-3 py-1.5 text-background text-xs has-data-[slot=kbd]:pr-1.5 data-closed:animate-out data-open:animate-in **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-none",
						className,
					)}
					{...props}
				>
					{children}
					<TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-none bg-foreground fill-foreground" />
				</TooltipPrimitive.Popup>
			</TooltipPrimitive.Positioner>
		</TooltipPrimitive.Portal>
	);
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
