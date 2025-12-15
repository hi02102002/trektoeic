import { cn } from "@/lib/utils";

export const SectionWithTitle = ({
	title,
	children,
	className,
	subtitle,
	iconBadge,
}: {
	title: string;
	children: React.ReactNode;
	subtitle?: string;
	className?: string;
	iconBadge?: React.ReactNode;
}) => {
	return (
		<section className={cn(className)}>
			<div className="mb-6 flex items-center gap-3 border-neutral-200 border-b pb-4">
				{iconBadge}
				<h2 className="font-medium text-lg text-neutral-900 tracking-tight">
					{title}
				</h2>
				<span className="ml-auto font-medium text-neutral-400 text-xs">
					{subtitle}
				</span>
			</div>
			{children}
		</section>
	);
};
