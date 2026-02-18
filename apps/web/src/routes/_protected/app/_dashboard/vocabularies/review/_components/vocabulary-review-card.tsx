import { LightningIcon } from "@phosphor-icons/react";
import { getYoudaoDictVoiceUrl } from "@trektoeic/utils/get-youdao-dictvoice-url";
import { useState } from "react";
import { AudioPlayButton } from "@/components/audio-play-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VocabularyReviewItem } from "./review-session-types";
import { VocabularyReviewDunnoDetailDrawer } from "./vocabulary-review-dunno-detail-drawer";

const getFallbackImageUrl = (word: string) =>
	`https://th.bing.com/th?q=${encodeURIComponent(word)}&c=7&rs=1&p=0&o=5&dpr=2&pid=1.7&mkt=en-WW&cc=VN&setlang=en&adlt=moderate&t=1`;

type VocabularyReviewCardProps = {
	current: VocabularyReviewItem;
	isRevealed: boolean;
	cardStyle: string;
	categoryName?: string;
	onReveal: () => void;
};

export function VocabularyReviewCard({
	current,
	isRevealed,
	cardStyle,
	categoryName,
	onReveal,
}: VocabularyReviewCardProps) {
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

	const pronunciationAudioSrc =
		current.collection?.us?.sound ??
		current.collection?.uk?.sound ??
		getYoudaoDictVoiceUrl(current.name);
	const exampleAudioSrc = current.example
		? getYoudaoDictVoiceUrl(current.example)
		: "";

	return (
		<div className={cn(cardStyle)}>
			<div className="mb-7 flex w-full items-center justify-center gap-2">
				<span className="inline-flex items-center gap-1 rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-medium text-[10px] text-neutral-600 uppercase tracking-[0.12em]">
					<LightningIcon className="size-3 text-amber-500" />
					{current.type}
				</span>
				{categoryName ? (
					<span className="inline-flex items-center rounded border border-neutral-200 bg-white px-2 py-0.5 font-medium text-[10px] text-neutral-600 uppercase tracking-[0.12em]">
						{categoryName}
					</span>
				) : null}
			</div>

			<div className="space-y-3 text-center">
				<h3 className="font-medium text-4xl text-neutral-900 tracking-tight md:text-5xl">
					{current.name}
				</h3>
				<div className="flex items-center justify-center gap-2">
					<p className="font-mono text-neutral-400 text-sm">
						{current.collection?.uk.spell || current.collection?.us.spell || ""}
					</p>
					<AudioPlayButton
						className="size-7"
						src={pronunciationAudioSrc}
						ariaLabel="Play pronunciation"
					/>
				</div>
			</div>

			<div className="my-8 border-neutral-100 border-t" />
			<div className="mb-8 flex justify-center">
				<img
					src={getFallbackImageUrl(current.name)}
					alt={current.name}
					className="h-48 w-full max-w-md rounded-lg object-contain"
				/>
			</div>
			{isRevealed ? (
				<div className="space-y-6">
					<p className="text-center font-light text-lg text-neutral-700 leading-relaxed md:text-xl">
						{current.meaning}
					</p>
					<div className="flex justify-center">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsDetailDrawerOpen(true)}
						>
							Chi tiết từ
						</Button>
					</div>
					<div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
						<div className="mb-2 flex items-center justify-between gap-2">
							<span className="text-muted-foreground text-xs">Ví dụ</span>
							<AudioPlayButton
								className="size-7"
								src={exampleAudioSrc}
								ariaLabel="Play example sentence"
							/>
						</div>
						<p className="text-neutral-600 text-sm leading-relaxed">
							"{current.example}"
						</p>
					</div>
					<VocabularyReviewDunnoDetailDrawer
						keyword={current.name}
						open={isDetailDrawerOpen}
						onOpenChange={setIsDetailDrawerOpen}
					/>
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
