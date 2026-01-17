import { cn } from "@/lib/utils";

type FilterOption = {
	label: string;
	value: string;
};

type Props = {
	options: FilterOption[];
	value: string;
	onChange: (value: string) => void;
	className?: string;
};

export const MockTestFilter = ({
	options,
	value,
	onChange,
	className,
}: Props) => {
	return (
		<div className={cn("flex flex-wrap gap-2", className)}>
			{options.map((option) => (
				<button
					type="button"
					key={option.value}
					onClick={() => onChange(option.value)}
					className={cn(
						"cursor-pointer rounded-full border px-3 py-1.5 font-medium text-sm transition-all duration-150",
						value === option.value
							? "border-primary bg-primary text-primary-foreground"
							: "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
};
