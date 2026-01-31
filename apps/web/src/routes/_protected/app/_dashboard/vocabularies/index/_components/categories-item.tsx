import { NotebookIcon } from "@phosphor-icons/react";
import { Link, type LinkProps } from "@tanstack/react-router";
import type { VocabularyCategory } from "@trektoeic/schemas/vocabularies-schema";
import { useMemo } from "react";
import { IconBadge } from "@/components/icon-badge";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { cn } from "@/lib/utils";
import {
	CATEGORY_COLOR_CLASSES,
	getCategoryColor,
} from "@/utils/get-category-color";

export const CategoryItem = ({
	category,
}: {
	category: VocabularyCategory;
}) => {
	const cardStyle = useCardStyle();
	const categoryColor = useMemo(
		() => getCategoryColor(category.id),
		[category.id],
	);
	const colorClasses = useMemo(
		() => CATEGORY_COLOR_CLASSES[categoryColor],
		[categoryColor],
	);

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
				<IconBadge color={categoryColor} className="size-8">
					<NotebookIcon weight="duotone" />
				</IconBadge>
				<div
					className={cn(
						"rounded px-2 py-1 font-semibold text-[10px] uppercase tracking-wide",
						colorClasses.badgeBg,
						colorClasses.badgeText,
					)}
				>
					{category.alias}
				</div>
			</div>
			<h3 className="mb-1 font-semibold text-primary text-sm">
				{category.name}
			</h3>
			<div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
				<span>Progress</span>
				<span className="font-medium text-primary">65%</span>
			</div>
			<div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
				<div className={cn("h-full rounded-full", colorClasses.progressBar)} />
			</div>
			<div className="flex items-center gap-3 border-border border-t pt-3">
				{typeof category.totalWords === "number" && (
					<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
						{category.totalWords} words
					</div>
				)}
			</div>
		</Link>
	);
};
