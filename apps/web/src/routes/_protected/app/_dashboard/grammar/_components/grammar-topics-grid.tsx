import type { GrammarTopicSummary } from "@trektoeic/schemas/grammar-course-file-schema";
import { GrammarTopicCard } from "./grammar-topic-card";

type CourseEntry = [
	string,
	{ courseTitle: string; topics: GrammarTopicSummary[] },
];

export function GrammarTopicsGrid({ byCourse }: { byCourse: CourseEntry[] }) {
	return (
		<div className="space-y-8">
			{byCourse.map(([courseSlug, { courseTitle, topics: items }]) => (
				<section key={courseSlug} className="space-y-5">
					<div className="border-neutral-200 border-b pb-5">
						<h2 className="font-semibold text-neutral-900 text-sm">
							{courseTitle}
						</h2>
						<p className="text-neutral-500 text-xs">
							{items.length} chủ đề trong khóa này
							{items.some((t) => t.studied)
								? ` · ${items.filter((t) => t.studied).length} đã học`
								: null}
						</p>
					</div>
					<div className="grid min-h-0 min-w-0 grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
						{items.map((topic) => (
							<div
								key={topic.slug}
								className="flex h-full min-h-0 min-w-0 flex-col"
							>
								<GrammarTopicCard topic={topic} />
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	);
}
