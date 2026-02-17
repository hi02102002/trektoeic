import { cn } from "@/lib/utils";
import type { GradeOption } from "./review-session-constants";
import type { VocabularyReviewItem } from "./review-session-types";

type VocabularyReviewGradesProps = {
	grades: readonly GradeOption[];
	current: VocabularyReviewItem;
	isRevealed: boolean;
	isSubmitting: boolean;
	onChoose: (gradeIndex: number) => void;
};

export function VocabularyReviewGrades({
	grades,
	current,
	isRevealed,
	isSubmitting,
	onChoose,
}: VocabularyReviewGradesProps) {
	return (
		<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
			{grades.map((grade, gradeIndex) => {
				const intervalLabel =
					current.preview?.[grade.key]?.intervalLabel ?? grade.timeFallback;

				return (
					<button
						key={grade.key}
						type="button"
						disabled={!isRevealed || isSubmitting}
						onClick={() => onChoose(gradeIndex)}
						className={cn(
							"rounded-lg border bg-white px-3 py-3 text-left transition-all",
							"disabled:cursor-not-allowed disabled:opacity-45",
							grade.className,
						)}
					>
						<div className="flex items-center justify-between gap-2">
							<div className="font-medium text-sm">{grade.label}</div>
							<div className="rounded border border-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500">
								{gradeIndex + 1}
							</div>
						</div>
						<div className="mt-1 font-mono text-[11px] text-neutral-500">
							{intervalLabel}
						</div>
					</button>
				);
			})}
		</div>
	);
}
