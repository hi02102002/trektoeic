import { BellSimpleRingingIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export const Route = createFileRoute("/_protected/app/_dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Empty className="min-h-[60vh]">
			<EmptyHeader className="max-w-lg">
				<EmptyMedia variant="icon">
					<BellSimpleRingingIcon weight="duotone" className="size-6" />
				</EmptyMedia>
				<EmptyTitle>Tính năng luyện tập đã được cập bến!!!</EmptyTitle>
				<EmptyDescription>
					Trải nghiệm tính năng luyện tập mới ngay bây giờ.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent className="max-w-lg">
				<Link to="/app/practices" className={buttonVariants({ size: "lg" })}>
					Bắt đầu luyện tập
				</Link>
			</EmptyContent>
		</Empty>
	);
}
