import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";

export interface FilterButtonGroupOption {
	label: string;
	value: string;
}

export interface FilterButtonGroupProps {
	options: FilterButtonGroupOption[];
	value: string;
	onValueChange: (value: string) => void;
	allLabel?: string;
	className?: string;
}

export function FilterButtonGroup({
	options,
	value,
	onValueChange,
	className = "",
}: FilterButtonGroupProps) {
	return (
		<ToggleGroup.Root
			type="single"
			value={String(value)}
			onValueChange={onValueChange}
			className={cn("flex gap-3", className)}
		>
			{options.map((option) => (
				<ToggleGroup.Item
					key={option.value}
					value={String(option.value)}
					className={`cursor-pointer rounded-full border px-4 py-2 font-medium text-sm ${value === option.value ? "bg-primary text-primary-foreground" : "border-gray-300 bg-primary-foreground text-primary"}`}
				>
					{option.label}
				</ToggleGroup.Item>
			))}
		</ToggleGroup.Root>
	);
}
