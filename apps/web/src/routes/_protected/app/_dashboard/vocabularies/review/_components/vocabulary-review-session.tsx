import { useHotkey } from "@tanstack/react-hotkeys";
import { useMutation } from "@tanstack/react-query";
import type { VocabularyCategory } from "@trektoeic/schemas/vocabularies-schema";
import { useState } from "react";
import { toast } from "sonner";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { orpc } from "@/lib/orpc/orpc";
import { playAudioExclusive } from "@/utils/play-audio-exclusive";
import { GRADES, HOTKEY_HINTS } from "./review-session-constants";
import type { VocabularyReviewItem } from "./review-session-types";
import { VocabularyReviewCard } from "./vocabulary-review-card";
import { VocabularyReviewEmptyState } from "./vocabulary-review-empty-state";
import { VocabularyReviewGrades } from "./vocabulary-review-grades";
import { VocabularyReviewHotkeyHints } from "./vocabulary-review-hotkey-hints";
import { VocabularyReviewProgress } from "./vocabulary-review-progress";

type VocabularyReviewSessionProps = {
	category?: VocabularyCategory;
	items: VocabularyReviewItem[];
};

export function VocabularyReviewSession({
	category,
	items,
}: VocabularyReviewSessionProps) {
	const [index, setIndex] = useState(0);
	const [isRevealed, setIsRevealed] = useState(false);
	const cardStyle = useCardStyle();
	const submitReviewGradeMutation = useMutation(
		orpc.vocabularyReview.submitReviewGrade.mutationOptions(),
	);

	const current = items[index];
	const total = items.length;
	const completionPercent =
		total > 0 ? Math.round(((index + 1) / total) * 100) : 0;

	const nextCard = (options?: { canAdvance?: boolean }) => {
		if (!options?.canAdvance) return;
		setIndex((old) => Math.min(old + 1, total));
		setIsRevealed(false);
	};

	const handleShowAnswer = () => {
		if (isRevealed) return;
		setIsRevealed(true);
	};

	const handlePlayAudio = () => {
		if (!current) return;
		const sound =
			current.collection?.us?.sound ?? current.collection?.uk?.sound;
		if (!sound) return;
		void playAudioExclusive(sound);
	};

	const handleQuickChoose = (gradeIndex: number) => {
		if (!isRevealed || !current) return;
		if (submitReviewGradeMutation.isPending) return;
		const selectedGrade = GRADES[gradeIndex];
		if (!selectedGrade) return;
		const previousIndex = index;
		const previousIsRevealed = isRevealed;

		nextCard({ canAdvance: true });

		submitReviewGradeMutation.mutate(
			{
				vocabularyId: current.id,
				grade: selectedGrade.key,
			},
			{
				onError: () => {
					setIndex(previousIndex);
					setIsRevealed(previousIsRevealed);
					toast.error("Không thể lưu kết quả ôn tập. Vui lòng thử lại.");
				},
			},
		);
	};

	useHotkey("Space", () => {
		handleShowAnswer();
	});

	useHotkey("P", () => {
		handlePlayAudio();
	});

	useHotkey("1", () => {
		handleQuickChoose(0);
	});

	useHotkey("2", () => {
		handleQuickChoose(1);
	});

	useHotkey("3", () => {
		handleQuickChoose(2);
	});

	useHotkey("4", () => {
		handleQuickChoose(3);
	});

	if (!current) {
		return <VocabularyReviewEmptyState />;
	}

	return (
		<div className="space-y-6">
			<VocabularyReviewProgress
				category={category}
				currentCategoryName={current.category?.name}
				index={index}
				total={total}
				completionPercent={completionPercent}
			/>
			<div className="mx-auto max-w-4xl space-y-5">
				<VocabularyReviewCard
					current={current}
					isRevealed={isRevealed}
					cardStyle={cardStyle}
					categoryName={current.category?.name}
					onReveal={handleShowAnswer}
				/>
				<VocabularyReviewGrades
					grades={GRADES}
					current={current}
					isRevealed={isRevealed}
					isSubmitting={submitReviewGradeMutation.isPending}
					onChoose={handleQuickChoose}
				/>
				<VocabularyReviewHotkeyHints hints={HOTKEY_HINTS} />
			</div>
		</div>
	);
}
