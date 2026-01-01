import { Check, X } from "@phosphor-icons/react";
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
	const getOptionStyles = () => {
		// After checking: show correct (green) or wrong (red)
		if (isChecked) {
			if (isCorrect) {
				return "bg-green-50 border-green-200 text-green-900 ";
			}
			if (isWrong) {
				return "bg-red-50 border-red-200 text-red-900 ";
			}
		}

		// Before checking: selected = violet, not selected = default
		if (isSelected) {
			return "bg-violet-50 border-violet-200 text-violet-900 ";
		}

		return "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:";
	};

	const getBadge = () => {
		// Before checking: show "Bạn chọn" for selected option
		if (!isChecked && isSelected) {
			return (
				<span className="flex items-center gap-1.5 rounded-md bg-violet-100 px-2.5 py-1 font-medium text-violet-700 text-xs">
					Bạn chọn
				</span>
			);
		}

		if (!isChecked) return null;

		if (isCorrect) {
			return (
				<span className="flex items-center gap-1.5 rounded-md bg-green-100 px-2.5 py-1 font-medium text-green-700 text-xs">
					<Check weight="bold" className="size-3.5" />
					Đúng
				</span>
			);
		}

		if (isWrong) {
			return (
				<span className="flex items-center gap-1.5 rounded-md bg-red-100 px-2.5 py-1 font-medium text-red-700 text-xs">
					<X weight="bold" className="size-3.5" />
					Sai
				</span>
			);
		}

		return null;
	};

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled || isChecked}
			className={cn(
				"flex w-full items-center justify-between gap-2 rounded-lg border p-3 text-left text-sm transition-all duration-200",
				getOptionStyles(),
				disabled && "cursor-not-allowed",
				!disabled && !isChecked && "cursor-pointer",
			)}
		>
			<div className="flex items-center gap-2.5">
				<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-current/10 font-medium text-xs">
					{label}
				</span>
				<span className="text-sm leading-relaxed">{value}</span>
			</div>
			{getBadge()}
		</button>
	);
}
