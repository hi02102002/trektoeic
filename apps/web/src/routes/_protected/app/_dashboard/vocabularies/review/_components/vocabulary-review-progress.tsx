import type { VocabularyCategory } from "@trektoeic/schemas/vocabularies-schema";

type VocabularyReviewProgressProps = {
	category?: VocabularyCategory;
	index: number;
	total: number;
	completionPercent: number;
};

export function VocabularyReviewProgress({
	category,
	index,
	total,
	completionPercent,
}: VocabularyReviewProgressProps) {
	return (
		<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
			<div>
				<div className="mb-1.5 inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-2.5 py-1">
					<span className="size-1.5 rounded-full bg-emerald-500" />
					<span className="font-medium text-[10px] text-neutral-600 uppercase tracking-[0.12em]">
						{category?.name ?? "General review"}
					</span>
				</div>
			</div>
			<div className="min-w-48">
				<div className="mb-1.5 flex items-center justify-between font-mono text-neutral-500 text-xs">
					<span>
						Card {index + 1} / {total}
					</span>
					<span>{completionPercent}%</span>
				</div>
				<div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
					<div
						className="h-full rounded-full bg-neutral-900 transition-all"
						style={{ width: `${completionPercent}%` }}
					/>
				</div>
			</div>
		</div>
	);
}
