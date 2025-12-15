import { IconBadge } from "@/components/icon-badge";
import { MAP_PART } from "@/constants";
import { cn } from "@/lib/utils";

const MAP_COLOR = {
	indigo: {
		icon: "group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600",
		hoverText: "group-hover:text-indigo-600",
		wrapper:
			"hover:border-neutral-300 hover:shadow hover:shadow-neutral-200/50",
	},
	emerald: {
		icon: "group-hover:border-teal-100 group-hover:bg-teal-50 group-hover:text-teal-600",
		hoverText: "group-hover:text-teal-600",
		wrapper:
			"hover:border-neutral-300 hover:shadow hover:shadow-neutral-200/50",
	},
} as const;

export const PartSectionCard = ({
	part,
	totalQuestions,
}: {
	part: keyof typeof MAP_PART;
	totalQuestions?: number;
}) => {
	const { title, desc, Icon, color } = MAP_PART[part];
	const colorClasses = MAP_COLOR[color];
	return (
		<div
			className={cn(
				"group relative flex h-full flex-col justify-between overflow-hidden rounded-md border border-neutral-200 bg-white p-5 transition-all duration-300",
				colorClasses.wrapper,
			)}
		>
			<div>
				<div className="mb-4 flex items-start justify-between">
					<IconBadge color="neutral" className={colorClasses.icon}>
						<Icon size={20} weight="duotone" />
					</IconBadge>
					<span className="inline-flex items-center rounded bg-neutral-100 px-2 py-1 font-medium text-[10px] text-neutral-600">
						Part {part}
					</span>
				</div>
				<h3 className="mb-1 font-semibold text-neutral-900 text-sm">{title}</h3>
				<p className="text-neutral-500 text-xs">{desc}</p>
			</div>
			<div className="mt-6 border-neutral-100 border-t pt-4">
				<div className="flex items-center justify-between text-neutral-400 text-xs">
					<span>{totalQuestions ?? "--"} Questions</span>
					<span
						className={cn(
							"flex items-center gap-1 transition-colors",
							colorClasses.hoverText,
						)}
					>
						Start{" "}
						<span
							className="iconify"
							data-icon="lucide:arrow-right"
							data-width="12"
						/>
					</span>
				</div>
			</div>
		</div>
	);
};
