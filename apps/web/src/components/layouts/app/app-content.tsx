import type { ReactNode } from "react";

type Props = {
	breadcrumbs?: ReactNode;
	header?: ReactNode;
	children?: ReactNode;
	className?: string;
};

export const AppContent = ({
	breadcrumbs,
	children,
	header,
	className,
}: Props) => {
	return (
		<div className={className}>
			{breadcrumbs && <div className="mb-4">{breadcrumbs}</div>}
			{header && <div className="mb-12">{header}</div>}
			{children}
		</div>
	);
};
