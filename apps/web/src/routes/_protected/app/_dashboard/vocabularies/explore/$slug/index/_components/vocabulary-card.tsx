import { BookmarkIcon, CheckCircleIcon } from "@phosphor-icons/react";
import type { Vocabulary } from "@trektoeic/schemas/vocabularies-schema";
import type { VocabularyReviewStateSchema } from "@trektoeic/schemas/vocabularies-shared-schema";
import { getYoudaoDictVoiceUrl } from "@trektoeic/utils/get-youdao-dictvoice-url";
import type z from "zod";
import { AudioPlayButton } from "@/components/audio-play-button";
import { Button } from "@/components/ui/button";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { cn } from "@/lib/utils";

const PROFICIENCY_STYLES: Record<
	z.infer<typeof VocabularyReviewStateSchema>,
	{ label: string; bars: string; checkVisible?: boolean }
> = {
	new: { label: "New", bars: "bg-muted-foreground/20" },
	learning: { label: "Learning", bars: "bg-primary/60" },
	review: { label: "Review", bars: "bg-primary", checkVisible: true },
	mastered: { label: "Mastered", bars: "bg-primary", checkVisible: true },
};

function getPronunciation(word: Vocabulary): string {
	const c = word.collection;
	const isSpellingSame =
		c?.uk?.spell === word.name || c?.us?.spell === word.name;
	if (isSpellingSame) return word.spelling ?? "";

	if (c?.uk?.spell) return c.uk.spell;
	if (c?.us?.spell) return c.us.spell;
	return word.spelling ?? "";
}

type VocabularyCardProps = {
	word: Vocabulary;
};

export function VocabularyCard({ word }: VocabularyCardProps) {
	const pronunciation = getPronunciation(word);
	const styles = PROFICIENCY_STYLES[word.state];

	const cardStyle = useCardStyle();
	const pronunciationAudioSrc =
		word.collection?.us?.sound ??
		word.collection?.uk?.sound ??
		getYoudaoDictVoiceUrl(word.name);
	const exampleAudioSrc = word.example
		? getYoudaoDictVoiceUrl(word.example)
		: "";

	return (
		<div className={cn(cardStyle)}>
			{styles.checkVisible && (
				<div className="absolute top-4 right-4 text-primary opacity-0 transition-opacity group-hover:opacity-100">
					<CheckCircleIcon weight="fill" className="size-5" />
				</div>
			)}
			<div className="mb-2 flex items-start justify-between">
				<h3 className="font-bold text-foreground text-lg">{word.name}</h3>
			</div>
			<div className="mb-4 flex items-center gap-2">
				{pronunciation && (
					<span className="font-mono text-muted-foreground text-xs">
						{pronunciation}
					</span>
				)}
				<AudioPlayButton
					className="size-6"
					iconClassName="size-3.5"
					src={pronunciationAudioSrc}
					ariaLabel="Play pronunciation"
				/>
			</div>
			<p className="mb-4 font-medium text-foreground text-sm">{word.meaning}</p>
			{word.example && (
				<div className="mb-4 rounded-md border border-border bg-muted p-3">
					<div className="mb-2 flex items-center justify-between gap-2">
						<span className="text-muted-foreground text-xs">Ví dụ</span>
						<AudioPlayButton
							className="size-6"
							iconClassName="size-3.5"
							src={exampleAudioSrc}
							ariaLabel="Play example sentence"
						/>
					</div>
					<p className="text-muted-foreground text-xs italic leading-relaxed">
						"{word.example}"
					</p>
				</div>
			)}

			<div className="mt-auto flex items-center justify-between border-border border-t pt-2">
				<div
					className="flex items-center gap-0.5"
					title={`Proficiency: ${styles.label}`}
				>
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className={cn(
								"h-3 w-1.5 rounded-sm",
								i <=
									(word.state === "new" ? 1 : word.state === "learning" ? 2 : 4)
									? styles.bars
									: "bg-muted-foreground/20",
							)}
						/>
					))}
					<span className="ml-2 font-medium text-[10px] text-muted-foreground uppercase">
						{styles.label}
					</span>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="size-8 text-muted-foreground hover:text-primary"
					aria-label="Bookmark"
				>
					<BookmarkIcon weight="regular" className="size-[18px]" />
				</Button>
			</div>
		</div>
	);
}
