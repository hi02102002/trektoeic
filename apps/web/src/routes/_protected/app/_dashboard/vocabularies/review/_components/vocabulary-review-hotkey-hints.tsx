import { Kbd } from "@/components/ui/kbd";
import type { HotkeyHint } from "./review-session-constants";

type VocabularyReviewHotkeyHintsProps = {
	hints: readonly HotkeyHint[];
};

export function VocabularyReviewHotkeyHints({
	hints,
}: VocabularyReviewHotkeyHintsProps) {
	return (
		<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-white px-3 py-2">
			{hints.map((hotkeyHint) => (
				<div
					key={hotkeyHint.action}
					className="flex items-center gap-2 text-neutral-600 text-xs"
				>
					<Kbd className="min-w-9 rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 text-center font-mono text-[10px] text-neutral-700 shadow-sm">
						{hotkeyHint.key}
					</Kbd>
					<span>{hotkeyHint.action}</span>
				</div>
			))}
		</div>
	);
}
