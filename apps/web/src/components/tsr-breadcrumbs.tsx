import { Link, type LinkProps } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";

export type TsrBreadcrumbsProps = {
	breadcrumbs: Array<
		{
			label: string;
		} & Pick<LinkProps, "to" | "search" | "hash" | "params">
	>;
	className?: string;
};

export const TsrBreadcrumbs = ({
	breadcrumbs,
	className,
}: TsrBreadcrumbsProps) => {
	return (
		<Breadcrumb className={cn("flex-nowrap", className)}>
			<BreadcrumbList className="no-scrollbar flex-nowrap overflow-x-auto">
				{breadcrumbs.map((bc, index, arr) => {
					const isLast = index === arr.length - 1;
					return (
						<Fragment key={bc.to?.toString() + index.toString()}>
							<BreadcrumbItem className="shrink-0">
								{isLast ? (
									<BreadcrumbPage>{bc.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild className="whitespace-nowrap">
										<Link
											to={bc.to}
											search={bc.search}
											hash={bc.hash}
											params={bc.params}
										>
											{bc.label}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator />}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
