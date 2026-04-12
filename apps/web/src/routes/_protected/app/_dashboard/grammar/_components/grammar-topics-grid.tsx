import type { GrammarTopicSummary } from "@trektoeic/schemas/grammar-course-file-schema";
import { useLayoutEffect, useMemo, useState } from "react";
import { WindowVirtualizer } from "virtua";
import { GrammarTopicCard } from "./grammar-topic-card";

type CourseEntry = [
	string,
	{ courseTitle: string; topics: GrammarTopicSummary[] },
];

/** Match Tailwind `sm` / `xl` with the previous static grid. */
const SM = 640;
const XL = 1280;

/**
 * Hint for first paint; virtua still measures real row height.
 * Include ~one row gap so scroll estimates stay sane with `pb-4` between virtual rows.
 */
const ROW_ITEM_SIZE_HINT_PX = 296;

function useResponsiveColumns() {
	const [columns, setColumns] = useState(1);

	useLayoutEffect(() => {
		const read = () => {
			if (typeof window === "undefined") return;
			const w = window.innerWidth;
			if (w >= XL) setColumns(3);
			else if (w >= SM) setColumns(2);
			else setColumns(1);
		};
		read();
		window.addEventListener("resize", read);
		return () => window.removeEventListener("resize", read);
	}, []);

	return columns;
}

function VirtualizedCourseTopicRows({
	courseKey,
	items,
}: {
	courseKey: string;
	items: GrammarTopicSummary[];
}) {
	const columns = useResponsiveColumns();
	const rowsLength = Math.ceil(items.length / columns);

	const gridTemplateColumns = useMemo(
		() =>
			({
				gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
			}) as const,
		[columns],
	);

	const rowKeys = useMemo(
		() => Array.from({ length: rowsLength }, (_, rowIndex) => rowIndex),
		[rowsLength],
	);

	return (
		<div className="w-full min-w-0">
			<WindowVirtualizer bufferSize={400} itemSize={ROW_ITEM_SIZE_HINT_PX}>
				{rowKeys.map((rowIndex) => (
					<div
						key={`${courseKey}:${columns}:${rowIndex}`}
						className="grid w-full gap-x-4 pb-4"
						style={gridTemplateColumns}
					>
						{Array.from({ length: columns }, (_, col) => {
							const topic = items[rowIndex * columns + col];
							if (!topic) return null;
							return (
								<div
									key={topic.slug}
									className="flex h-full min-h-0 min-w-0 flex-col"
								>
									<GrammarTopicCard topic={topic} />
								</div>
							);
						})}
					</div>
				))}
			</WindowVirtualizer>
		</div>
	);
}

export function GrammarTopicsGrid({ byCourse }: { byCourse: CourseEntry[] }) {
	return (
		<div className="space-y-8">
			{byCourse.map(([courseSlug, { courseTitle, topics: items }]) => (
				<section key={courseSlug} className="space-y-5">
					<div className="border-neutral-200 border-b pb-5">
						<h2 className="font-semibold text-neutral-900 text-sm">
							{courseTitle}
						</h2>
						<p className="text-neutral-500 text-xs">
							{items.length} chủ đề trong khóa này
							{items.some((t) => t.studied)
								? ` · ${items.filter((t) => t.studied).length} đã học`
								: null}
						</p>
					</div>
					<VirtualizedCourseTopicRows courseKey={courseSlug} items={items} />
				</section>
			))}
		</div>
	);
}
