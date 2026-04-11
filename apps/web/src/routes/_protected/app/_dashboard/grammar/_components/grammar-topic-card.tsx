import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { GrammarTopicSummary } from "@trektoeic/schemas/grammar-course-file-schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function GrammarTopicCard({ topic }: { topic: GrammarTopicSummary }) {
	return (
		<Link
			to="/app/grammar/$slug"
			params={{ slug: topic.slug }}
			className="group flex min-h-0 w-full min-w-0 flex-1 flex-col"
			data-course-slug={topic.courseSlug}
		>
			<Card className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col">
				<CardContent className="flex h-full min-h-0 flex-1 flex-col">
					<div className="flex min-h-0 flex-1 flex-col">
						<div className="mb-3 flex shrink-0 flex-wrap gap-1.5">
							{topic.relatedParts.map((p) => (
								<Badge
									key={p}
									variant="secondary"
									className="font-medium text-[10px] text-neutral-600"
								>
									Part {p}
								</Badge>
							))}
						</div>
						<h3 className="mb-1.5 line-clamp-2 min-h-10 font-semibold text-neutral-900 text-sm leading-5">
							{topic.title}
						</h3>
						<p className="line-clamp-3 max-h-[4.5rem] min-h-[4.5rem] overflow-hidden text-neutral-500 text-xs leading-6">
							{topic.description}
						</p>
					</div>
					<div className="mt-auto flex shrink-0 items-center justify-between border-neutral-100 border-t pt-4 text-neutral-400 text-xs">
						<span>{topic.exerciseCount} câu luyện tập</span>
						<span className="flex items-center gap-1 font-medium text-neutral-600 transition-colors group-hover:text-violet-600">
							Học ngay
							<ArrowRightIcon className="size-3.5" weight="bold" />
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
