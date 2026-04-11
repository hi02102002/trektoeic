"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Progress({
	className,
	value,
	...props
}: Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "value"> & {
	value?: number | null;
}) {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			value={value ?? null}
			className={cn(
				"relative flex h-1 w-full items-center overflow-x-hidden rounded-none bg-muted",
				className,
			)}
			{...props}
		>
			<ProgressPrimitive.Track className="size-full overflow-hidden">
				<ProgressPrimitive.Indicator
					data-slot="progress-indicator"
					className="size-full flex-1 bg-primary transition-all"
				/>
			</ProgressPrimitive.Track>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
