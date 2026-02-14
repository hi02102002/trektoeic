import { Link, type LinkProps } from "@tanstack/react-router";
import type { VocabularyCategory } from "@trektoeic/schemas/vocabularies-schema";
import { useMemo } from "react";
import { IconBadge } from "@/components/icon-badge";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { cn } from "@/lib/utils";

export const CategoryItem = ({
	category,
}: {
	category: VocabularyCategory;
}) => {
	const cardStyle = useCardStyle();

	const linkOptions = useMemo(() => {
		if (category.hasChild) {
			return {
				to: "/app/vocabularies",
				search: (old) => ({
					...old,
					parentId: category.id,
					level: category.level + 1,
				}),
			} as LinkProps;
		}

		return {
			to: "/app/vocabularies/$slug",
			params: {
				slug: category.slug,
			},
		} as LinkProps;
	}, [category]);

	return (
		<Link {...linkOptions} className={cn(cardStyle)}>
			<div className="mb-4 flex cursor-pointer items-start justify-between">
				<IconBadge color="indigo" className="size-8">
					📚
				</IconBadge>
			</div>
			<h3 className="mb-1 font-semibold text-primary text-sm">
				{category.name}
			</h3>
			<div className="mb-2 flex items-center justify-between text-muted-foreground text-xs">
				<span>
					{category.learnedWords} / {category.totalWords} từ
				</span>
				<span className="font-medium text-primary">
					{category.progressPct}%
				</span>
			</div>
			<div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
				<div
					className={cn("h-full rounded-full bg-indigo-700")}
					style={{ width: `${category.progressPct}%` }}
				/>
			</div>
			<div className="flex items-center gap-3 border-border border-t pt-3">
				<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
					{category.dueWords} từ cần ôn tập
				</div>
			</div>
		</Link>
	);
};
