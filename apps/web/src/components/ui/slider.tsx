import {
	Slider as SliderPrimitive,
	type SliderRoot,
} from "@base-ui/react/slider";
import * as React from "react";

import { cn } from "@/lib/utils";

type SliderRangeProps = Omit<SliderRoot.Props<[number, number]>, "children">;

function Slider({
	className,
	defaultValue,
	value,
	min = 0,
	max = 100,
	...props
}: SliderRangeProps) {
	const _values = React.useMemo(
		() =>
			Array.isArray(value)
				? value
				: Array.isArray(defaultValue)
					? defaultValue
					: [min, max],
		[value, defaultValue, min, max],
	);

	return (
		<SliderPrimitive.Root
			data-slot="slider"
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			className={cn("w-full data-disabled:opacity-50", className)}
			{...props}
		>
			<SliderPrimitive.Control
				data-slot="slider-control"
				className="relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"
			>
				<SliderPrimitive.Track
					data-slot="slider-track"
					className="relative grow overflow-hidden rounded-none bg-muted data-[orientation=horizontal]:h-1 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1"
				>
					<SliderPrimitive.Indicator
						data-slot="slider-range"
						className="absolute select-none bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
					/>
				</SliderPrimitive.Track>
				{Array.from({ length: _values.length }, (_, index) => (
					<SliderPrimitive.Thumb
						data-slot="slider-thumb"
						key={index}
						index={index}
						className="relative block size-3 shrink-0 select-none rounded-none border border-ring bg-white ring-ring/50 transition-[color,box-shadow] after:absolute after:-inset-2 hover:ring-1 focus-visible:outline-hidden focus-visible:ring-1 active:ring-1 disabled:pointer-events-none disabled:opacity-50"
					/>
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };
