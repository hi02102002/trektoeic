import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext<
	VariantProps<typeof toggleVariants> & {
		spacing?: number;
		orientation?: "horizontal" | "vertical";
	}
>({
	size: "default",
	variant: "default",
	spacing: 0,
	orientation: "horizontal",
});

type ToggleGroupBaseProps = Omit<
	React.ComponentProps<typeof ToggleGroupPrimitive>,
	"defaultValue" | "multiple" | "onValueChange" | "value"
> &
	VariantProps<typeof toggleVariants> & {
		spacing?: number;
		orientation?: "horizontal" | "vertical";
	};

type ToggleGroupSingleProps = ToggleGroupBaseProps & {
	type?: "single";
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
};

type ToggleGroupMultipleProps = ToggleGroupBaseProps & {
	type: "multiple";
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (value: string[]) => void;
};

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

type ToggleGroupItemProps = Omit<
	React.ComponentProps<typeof TogglePrimitive>,
	"value"
> &
	VariantProps<typeof toggleVariants> & {
		value: string;
	};

function normalizeGroupValue(value?: string | string[]) {
	if (value === undefined) {
		return undefined;
	}

	if (Array.isArray(value)) {
		return value;
	}

	return value ? [value] : [];
}

function ToggleGroup({
	className,
	type = "single",
	variant,
	size,
	spacing = 0,
	orientation = "horizontal",
	children,
	value: groupValue,
	defaultValue: groupDefaultValue,
	onValueChange,
	...props
}: ToggleGroupProps) {
	const value = normalizeGroupValue(groupValue);
	const defaultValue = normalizeGroupValue(groupDefaultValue);

	return (
		<ToggleGroupPrimitive
			data-slot="toggle-group"
			data-variant={variant}
			data-size={size}
			data-spacing={spacing}
			data-orientation={orientation}
			style={{ "--gap": spacing } as React.CSSProperties}
			className={cn(
				"group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-none data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[size=sm]:rounded-none",
				className,
			)}
			multiple={type === "multiple"}
			orientation={orientation}
			value={value}
			defaultValue={defaultValue}
			onValueChange={(nextValue) => {
				if (type === "multiple") {
					(onValueChange as ToggleGroupMultipleProps["onValueChange"])?.(
						nextValue,
					);
					return;
				}

				(onValueChange as ToggleGroupSingleProps["onValueChange"])?.(
					nextValue[0] ?? "",
				);
			}}
			{...props}
		>
			<ToggleGroupContext.Provider
				value={{ variant, size, spacing, orientation }}
			>
				{children}
			</ToggleGroupContext.Provider>
		</ToggleGroupPrimitive>
	);
}

function ToggleGroupItem({
	className,
	children,
	variant = "default",
	size = "default",
	...props
}: ToggleGroupItemProps) {
	const context = React.useContext(ToggleGroupContext);

	return (
		<TogglePrimitive
			data-slot="toggle-group-item"
			data-variant={context.variant || variant}
			data-size={context.size || size}
			data-spacing={context.spacing}
			className={cn(
				"shrink-0 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:rounded-none group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-[spacing=0]/toggle-group:px-2 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:last:rounded-none group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:last:rounded-none group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:first:rounded-none group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:first:rounded-none",
				toggleVariants({
					variant: context.variant || variant,
					size: context.size || size,
				}),
				className,
			)}
			{...props}
		>
			{children}
		</TogglePrimitive>
	);
}

export { ToggleGroup, ToggleGroupItem };
