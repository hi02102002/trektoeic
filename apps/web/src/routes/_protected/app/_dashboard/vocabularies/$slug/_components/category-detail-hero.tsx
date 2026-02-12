import { CardsIcon, PencilSimpleIcon, PlayIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { VocabularyCategory } from "@trektoeic/schemas/vocabularies-schema";
import { useMemo } from "react";
import { IconBadge } from "@/components/icon-badge";
import { Button } from "@/components/ui/button";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { dayjs } from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import {
	CATEGORY_COLOR_CLASSES,
	getCategoryColor,
} from "@/utils/get-category-color";

const MOCK_MASTERED_PERCENT = 65;
const MOCK_MASTERED = 12;
const MOCK_LEARNING = 4;
const MOCK_NEW = 8;

type CategoryDetailHeroProps = {
	category: VocabularyCategory;
	totalWords: number;
};

export function CategoryDetailHero({
	category,
	totalWords,
}: CategoryDetailHeroProps) {
	const cardStyle = useCardStyle();

	const categoryColor = useMemo(
		() => getCategoryColor(category.id),
		[category.id],
	);
	const colorClasses = useMemo(
		() => CATEGORY_COLOR_CLASSES[categoryColor],
		[categoryColor],
	);
	const lastReviewed = useMemo(
		() => (category.updatedAt ? dayjs(category.updatedAt).fromNow() : null),
		[category.updatedAt],
	);

	const masteredPercent = Math.min(
		100,
		totalWords > 0 ? (MOCK_MASTERED / totalWords) * 100 : 0,
	);
	const learningPercent = Math.min(
		100 - masteredPercent,
		totalWords > 0 ? (MOCK_LEARNING / totalWords) * 100 : 0,
	);
	const newPercent = 100 - masteredPercent - learningPercent;

	return (
		<div className={cn(cardStyle)}>
			<div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
				<div className="min-w-0 flex-1">
					<div className="mb-4 flex items-center gap-3">
						<IconBadge className="size-12 rounded-xl text-xl">📚</IconBadge>
						<div>
							<h1 className="font-semibold text-2xl text-foreground tracking-tight">
								{category.name}
							</h1>
							<div className="mt-1 flex items-center gap-2">
								{category.alias && (
									<span
										className={cn(
											"rounded border px-2 py-0.5 font-semibold text-xs uppercase tracking-wide",
											"border-current/20",
										)}
									>
										{category.alias}
									</span>
								)}
								{lastReviewed && (
									<span className="text-muted-foreground text-xs">
										Last reviewed {lastReviewed}
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
						Danh sách từ vựng theo chủ đề {category.name}. Nắm vững vốn từ cần
						cần thiết cho kỳ thi TOEIC.
					</div>
					<div className="mt-8">
						<div className="mb-2 flex items-center justify-between text-xs">
							<span className="font-medium text-foreground">
								{MOCK_MASTERED_PERCENT}% Mastered
							</span>
							<span className="text-muted-foreground">
								{MOCK_MASTERED + MOCK_LEARNING} / {totalWords} words
							</span>
						</div>
						<div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
							<div
								className={cn("h-full", colorClasses.progressBar)}
								style={{ width: `${masteredPercent}%` }}
							/>
							<div
								className="h-full bg-primary/60"
								style={{ width: `${learningPercent}%` }}
							/>
							<div
								className="h-full bg-muted-foreground/20"
								style={{ width: `${newPercent}%` }}
							/>
						</div>
						<div className="mt-3 flex gap-4">
							<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<div
									className={cn(
										"size-2 rounded-full",
										colorClasses.progressBar,
									)}
								/>
								Mastered ({MOCK_MASTERED})
							</div>
							<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<div className="size-2 rounded-full bg-primary/60" />
								Learning ({MOCK_LEARNING})
							</div>
							<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<div className="size-2 rounded-full bg-muted-foreground/20" />
								New ({MOCK_NEW})
							</div>
						</div>
					</div>
				</div>

				<div className="flex w-full min-w-[300px] flex-col gap-3 sm:flex-row lg:w-auto">
					<Button
						asChild
						className="flex-1 shadow-lg shadow-primary/10"
						size="lg"
					>
						<Link
							to="/app/vocabularies/$slug"
							params={{ slug: category.slug }}
							search={{ study: "now" }}
						>
							<PlayIcon weight="bold" className="size-[18px]" />
							Study Now
						</Link>
					</Button>
					<div className="grid grid-cols-2 gap-3">
						<Button variant="outline" size="lg" className="font-medium" asChild>
							<Link
								to="/app/vocabularies/$slug"
								params={{ slug: category.slug }}
								search={{ mode: "flashcards" }}
							>
								<CardsIcon weight="duotone" className="size-[18px]" />
								Flashcards
							</Link>
						</Button>
						<Button variant="outline" size="lg" className="font-medium" asChild>
							<Link
								to="/app/vocabularies/$slug"
								params={{ slug: category.slug }}
								search={{ mode: "quiz" }}
							>
								<PencilSimpleIcon weight="duotone" className="size-[18px]" />
								Quiz
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
