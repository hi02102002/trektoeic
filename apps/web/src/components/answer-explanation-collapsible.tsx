import { CaretDown, CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export type AnswerExplanationTone = "correct" | "wrong" | "neutral";

/** Khối “Giải thích đáp án” — gọn, chỉ nhấn đúng/sai bằng viền/màu nhẹ. */
export function AnswerExplanationCollapsible({
	tone,
	defaultOpen = false,
	children,
}: {
	tone: AnswerExplanationTone;
	defaultOpen?: boolean;
	children: ReactNode;
}) {
	const isOk = tone === "correct";
	const isBad = tone === "wrong";

	return (
		<Collapsible defaultOpen={defaultOpen}>
			<div
				className={cn(
					"overflow-hidden rounded-lg border bg-white",
					isOk && "border-emerald-200",
					isBad && "border-red-200",
					tone === "neutral" && "border-neutral-200",
				)}
			>
				<CollapsibleTrigger
					className={cn(
						"group flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors",
						isOk && "bg-emerald-50/80 hover:bg-emerald-50",
						isBad && "bg-red-50/70 hover:bg-red-50/90",
						tone === "neutral" && "hover:bg-neutral-50",
					)}
				>
					<div className="flex items-center gap-2">
						{isOk ? (
							<CheckCircleIcon
								className="size-4 shrink-0 text-emerald-600"
								weight="fill"
							/>
						) : isBad ? (
							<XCircleIcon
								className="size-4 shrink-0 text-red-600"
								weight="fill"
							/>
						) : null}
						<span
							className={cn(
								"font-medium text-sm",
								isOk && "text-emerald-900",
								isBad && "text-red-900",
								tone === "neutral" && "text-neutral-900",
							)}
						>
							Giải thích đáp án
						</span>
					</div>
					<CaretDown
						className="size-4 shrink-0 text-neutral-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
						weight="bold"
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="border-neutral-100 border-t px-4 py-3">
						{children}
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
}
