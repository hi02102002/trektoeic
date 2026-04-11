"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import * as React from "react";

function Collapsible({
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function getRenderElement(children: React.ReactNode) {
	return React.isValidElement(children)
		? (children as React.ReactElement)
		: undefined;
}

function CollapsibleTrigger({
	asChild,
	children,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger> & {
	asChild?: boolean;
}) {
	if (asChild) {
		const render = getRenderElement(children);

		if (render) {
			return (
				<CollapsiblePrimitive.Trigger
					data-slot="collapsible-trigger"
					render={render}
					{...props}
				/>
			);
		}
	}

	return (
		<CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props}>
			{children}
		</CollapsiblePrimitive.Trigger>
	);
}

function CollapsibleContent({
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Panel>) {
	return (
		<CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
	);
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
