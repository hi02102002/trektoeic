import { LightningIcon, SpeakerHighIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VocabularyReviewItem } from "./review-session-types";

type VocabularyReviewCardProps = {
	current: VocabularyReviewItem;
	isRevealed: boolean;
	cardStyle: string;
	onReveal: () => void;
	onPlayAudio: () => void;
};

export function VocabularyReviewCard({
	current,
	isRevealed,
	cardStyle,
	onReveal,
	onPlayAudio,
}: VocabularyReviewCardProps) {
	return (
		<div className={cn(cardStyle)}>
			<div className="mb-7 flex w-full items-center justify-center">
				<span className="inline-flex items-center gap-1 rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-medium text-[10px] text-neutral-600 uppercase tracking-[0.12em]">
					<LightningIcon className="size-3 text-amber-500" />
					{current.type}
				</span>
			</div>

			<div className="space-y-3 text-center">
				<h3 className="font-medium text-4xl text-neutral-900 tracking-tight md:text-5xl">
					{current.name}
				</h3>
				<div className="flex items-center justify-center gap-2">
					<p className="font-mono text-neutral-400 text-sm">
						{current.collection?.uk.spell || current.collection?.us.spell || ""}
					</p>
					<Button
						variant="ghost"
						size="icon"
						className="size-7 rounded-full"
						onClick={onPlayAudio}
						aria-label="Play pronunciation"
					>
						<SpeakerHighIcon className="size-4" />
					</Button>
				</div>
			</div>

			<div className="my-8 border-neutral-100 border-t" />

			{current.image ? (
				<div className="mb-8 flex justify-center">
					<img
						src={current.image}
						alt={current.name}
						className="h-48 w-full max-w-md rounded-lg object-contain"
						loading="lazy"
					/>
				</div>
			) : null}

			{isRevealed ? (
				<div className="space-y-6">
					<p className="text-center font-light text-lg text-neutral-700 leading-relaxed md:text-xl">
						{current.meaning}
					</p>
					<div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
						<p className="text-neutral-600 text-sm leading-relaxed">
							"{current.example}"
						</p>
					</div>
				</div>
			) : (
				<div className="flex justify-center">
					<Button
						size="lg"
						variant="outline"
						className="w-full max-w-xs"
						onClick={onReveal}
					>
						Đáp án
					</Button>
				</div>
			)}
		</div>
	);
}
