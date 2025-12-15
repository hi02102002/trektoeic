import { cn } from "@/lib/utils";

export const AppHeader = ({
	title,
	description,
	right,
	className,
}: {
	title: string;
	description?: string;
	right?: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn("max-w-xl", className)}>
			<h1 className="font-medium text-2xl text-neutral-900 tracking-tight sm:text-3xl">
				{title}
			</h1>
			<p className="mt-3 text-neutral-600 text-sm leading-relaxed">
				{description}
			</p>
			{right}
		</div>
	);
};
