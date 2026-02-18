import { LightningIcon } from "@phosphor-icons/react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/layouts/app";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Route = getRouteApi("/_protected/app/_dashboard/vocabularies/");

export function VocabularyDashboardHeader() {
	const { user } = Route.useRouteContext();
	const { dueWords } = Route.useLoaderData();
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<AppHeader
				title="Từ vựng"
				description={
					<>
						Hellooo, <span className="font-semibold">{user.user.name}</span>!
						Hôm nay bạn có{" "}
						<span className="font-semibold">{dueWords.length}</span> từ cần ôn
						tập. Let's keep up the great work! 🚀
					</>
				}
				className="max-w-3xl"
			/>
			<div className="flex items-center gap-2">
				<Link
					to="/app/vocabularies/review"
					className={cn(buttonVariants({ size: "sm" }))}
				>
					<LightningIcon className="size-4" />
					Quick Review
				</Link>
			</div>
		</div>
	);
}
