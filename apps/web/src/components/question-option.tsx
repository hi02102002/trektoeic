import { cn } from "@/lib/utils";

interface QuestionOptionProps {
	label: string;
	value: string;
	isSelected: boolean;
	isCorrect?: boolean;
	isWrong?: boolean;
	isChecked: boolean;
	onClick: () => void;
	disabled?: boolean;
}

/**
 * Kiểu đáp án giống grammar (outline, emerald/đỏ khi đã chọn, nhãn A. B. …).
 */
export function QuestionOption({
	label,
	value,
	isSelected,
	isCorrect,
	isWrong,
	isChecked,
	onClick,
	disabled = false,
}: QuestionOptionProps) {
	const stateClass = (() => {
		if (isChecked) {
			if (isCorrect) {
				return "border-emerald-300 bg-emerald-50 text-emerald-900";
			}
			if (isWrong) {
				return "border-red-300 bg-red-50 text-red-900";
			}
		}
		if (isSelected) {
			return "border-violet-300 bg-violet-50 text-violet-900";
		}
		return "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50";
	})();

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled || isChecked}
			className={cn(
				"flex h-auto min-h-10 w-full items-start justify-start rounded-md border px-4 py-2 text-left text-sm transition-colors",
				stateClass,
				(disabled || isChecked) && "cursor-default",
				!disabled && !isChecked && "cursor-pointer",
			)}
		>
			<span className="mr-2 shrink-0 font-semibold text-neutral-400">
				{label}.
			</span>
			<span className="min-w-0 flex-1 whitespace-normal leading-relaxed">
				{value}
			</span>
		</button>
	);
}
