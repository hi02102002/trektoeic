import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const MAP_COLORS = {
	blue: "border-blue-100 bg-blue-50 text-blue-600",
	green: "border-green-100 bg-green-50 text-green-600",
	red: "border-red-100 bg-red-50 text-red-600",
	yellow: "border-yellow-100 bg-yellow-50 text-yellow-600",
	slate: "border-slate-100 bg-slate-50 text-slate-600",
	purple: "border-purple-100 bg-purple-50 text-purple-600",
	pink: "border-pink-100 bg-pink-50 text-pink-600",
	indigo: "border-indigo-100 bg-indigo-50 text-indigo-600",
	violet: "border-violet-100 bg-violet-50 text-violet-600",
	fuchsia: "border-fuchsia-100 bg-fuchsia-50 text-fuchsia-600",
	rose: "border-rose-100 bg-rose-50 text-rose-600",
	orange: "border-orange-100 bg-orange-50 text-orange-600",
	amber: "border-amber-100 bg-amber-50 text-amber-600",
	lime: "border-lime-100 bg-lime-50 text-lime-600",
	emerald: "border-emerald-100 bg-emerald-50 text-emerald-600",
	teal: "border-teal-100 bg-teal-50 text-teal-600",
	cyan: "border-cyan-100 bg-cyan-50 text-cyan-600",
	sky: "border-sky-100 bg-sky-50 text-sky-600",
	gray: "border-gray-100 bg-gray-50 text-gray-600",
	zinc: "border-zinc-100 bg-zinc-50 text-zinc-600",
	neutral: "border-neutral-100 bg-neutral-50 text-neutral-600",
	stone: "border-stone-100 bg-stone-50 text-stone-600",
};

export const iconBadgeVariants = cva(
	"flex size-10 items-center justify-center rounded-md border",
	{
		variants: {
			color: MAP_COLORS,
		},
		defaultVariants: {
			color: "blue",
		},
	},
);

type IconBadgeProps = React.ComponentProps<"div"> & {
	color?: keyof typeof MAP_COLORS;
};

export const IconBadge = ({
	color = "blue",
	className,
	children,
	...props
}: IconBadgeProps) => {
	return (
		<div
			className={cn(
				iconBadgeVariants({
					color,
				}),
				MAP_COLORS[color],
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};
