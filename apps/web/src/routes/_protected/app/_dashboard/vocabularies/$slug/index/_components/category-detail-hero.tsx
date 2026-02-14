import { CardsIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import type { VocabularyCategory } from "@trektoeic/schemas/vocabularies-schema";
import { IconBadge } from "@/components/icon-badge";
import { Button } from "@/components/ui/button";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { orpc } from "@/lib/orpc/orpc";
import { cn } from "@/lib/utils";

type CategoryDetailHeroProps = {
	category: VocabularyCategory;
	totalWords: number;
};

export function CategoryDetailHero({
	category,
	totalWords,
}: CategoryDetailHeroProps) {
	const cardStyle = useCardStyle();
	const { data: stats } = useQuery(
		orpc.vocabularyReview.getStats.queryOptions({
			input: { categoryId: category.id },
		}),
	);

	const masteredPercent = Math.min(
		100,
		totalWords > 0 ? ((stats?.masteredWords ?? 0) / totalWords) * 100 : 0,
	);
	const learningPercent = Math.min(
		100 - masteredPercent,
		totalWords > 0 ? ((stats?.learningWords ?? 0) / totalWords) * 100 : 0,
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
								{stats?.masteredWords ?? "--"} mastered,{" "}
								{stats?.learningWords ?? "--"} learning
							</span>
							<span className="text-muted-foreground">
								{stats?.totalWords
									? stats.masteredWords + stats.learningWords
									: "--"}{" "}
								/ {stats?.totalWords ?? "--"} từ
							</span>
						</div>
						<div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
							<div
								className={cn("h-full bg-indigo-700")}
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
								<div className={cn("size-2 rounded-full", "bg-indigo-700")} />
								Mastered ({stats?.masteredWords ?? "--"})
							</div>
							<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<div className="size-2 rounded-full bg-primary/60" />
								Learning ({stats?.learningWords ?? "--"})
							</div>
							<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<div className="size-2 rounded-full bg-muted-foreground/20" />
								New ({stats?.newWords ?? "--"})
							</div>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<Button variant="outline" size="lg" className="font-medium">
						<CardsIcon weight="duotone" className="size-[18px]" />
						Flashcards
					</Button>
					<Button variant="outline" size="lg" className="font-medium">
						<PencilSimpleIcon weight="duotone" className="size-[18px]" />
						Quiz
					</Button>
				</div>
			</div>
		</div>
	);
}
