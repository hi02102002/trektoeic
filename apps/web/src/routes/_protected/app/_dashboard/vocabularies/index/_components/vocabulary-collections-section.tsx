import { getRouteApi, Link } from "@tanstack/react-router";
import { PaginationControls } from "@/components/pagination-controls";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Route = getRouteApi("/_protected/app/_dashboard/vocabularies/");

export function VocabularyCollectionsSection() {
	const { categories } = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const pagination = categories.pagination;
	const page = pagination.currentPage;
	const totalPages = pagination.totalPages;

	return (
		<div className="grid-cols-12 space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-lg">Bộ sưu tập</h2>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{categories.items.map((category) => {
					const progress = category.progressPct ?? 0;
					const label = `${category.learnedWords ?? 0} / ${category.totalWords ?? 0} words`;
					const isExplore = Boolean(category.hasChild);
					return (
						<Card key={category.id}>
							<CardContent>
								<Link
									to={
										isExplore
											? "/app/vocabularies/explore"
											: "/app/vocabularies/explore/$slug"
									}
									search={
										isExplore
											? { parentId: category.id, level: category.level + 1 }
											: undefined
									}
									params={!isExplore ? { slug: category.slug } : undefined}
									className="block"
								>
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="font-semibold text-base">{category.name}</p>
											<p className="mt-1 text-muted-foreground text-sm">
												{label}
											</p>
										</div>
									</div>
									<div className="mt-4">
										<div className="mb-2 flex items-center justify-between text-muted-foreground text-xs">
											<span className="text-muted-foreground">Progress</span>
											<span className="font-medium text-primary">
												{progress}%
											</span>
										</div>
										<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
											<div
												className={cn("h-full rounded-full bg-indigo-700")}
												style={{ width: `${progress}%` }}
											/>
										</div>
									</div>
								</Link>

								<div className="mt-4 flex items-center justify-between gap-3 border-border border-t pt-3">
									<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
										{category.dueWords ?? 0} từ cần ôn tập
									</div>
									{!isExplore ? (
										<Link
											to="/app/vocabularies/review"
											search={{ categoryId: category.id }}
											className={cn(
												buttonVariants({ variant: "outline", size: "sm" }),
												"h-7 px-2.5 font-medium text-[11px]",
											)}
										>
											Học ngay
										</Link>
									) : (
										<span className="text-muted-foreground text-xs">
											Khám phá
										</span>
									)}
								</div>
							</CardContent>
						</Card>
					);
				})}

				<Card>
					<CardContent>
						<Link to="/app/vocabularies/explore" className="block">
							<div className="space-y-2 text-center">
								<div className="mx-auto flex size-9 items-center justify-center rounded-full border border-neutral-300">
									<span className="font-semibold text-lg">+</span>
								</div>
								<p className="text-muted-foreground text-xs">
									Tìm kiếm và thêm từ mới vào bộ sưu tập của bạn
								</p>
							</div>
						</Link>
					</CardContent>
				</Card>
			</div>

			<PaginationControls
				page={page}
				totalPages={totalPages}
				onPageChange={(nextPage) => {
					void navigate({
						search: {
							...search,
							page: nextPage,
						},
					});
				}}
			/>
		</div>
	);
}
