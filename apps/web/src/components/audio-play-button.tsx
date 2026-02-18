import { SpeakerHighIcon } from "@phosphor-icons/react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playAudioExclusive } from "@/utils/play-audio-exclusive";

type AudioPlayButtonProps = {
	src?: string | null;
	ariaLabel?: string;
	className?: string;
	iconClassName?: string;
	disabled?: boolean;
};

export function AudioPlayButton({
	src,
	ariaLabel = "Play audio",
	className,
	iconClassName,
	disabled,
}: AudioPlayButtonProps) {
	const audioSrc = src?.trim();
	const isDisabled = disabled || !audioSrc;

	const handlePlay = useCallback(() => {
		if (!audioSrc) return;
		void playAudioExclusive(audioSrc);
	}, [audioSrc]);

	return (
		<Button
			variant="ghost"
			size="icon"
			className={cn("rounded-full", className)}
			onClick={handlePlay}
			aria-label={ariaLabel}
			disabled={isDisabled}
		>
			<SpeakerHighIcon className={cn("size-4", iconClassName)} />
		</Button>
	);
}
