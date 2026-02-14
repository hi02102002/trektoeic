import { FireIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { VocabularyCategory } from "@trektoeic/schemas/vocabularies-schema";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DueVocabulary = {
	id: string;
	name: string;
	meaning: string;
	example: string;
	type: string;
	collection?: { uk: { spell: string }; us: { spell: string } } | null;
	review?: { state?: string | null } | null;
	preview?: Record<string, { intervalLabel?: string | null }> | null;
};

type VocabularyReviewSessionProps = {
	category: VocabularyCategory;
	items: DueVocabulary[];
};

const GRADES = [
	{
		key: "again",
		label: "Again",
		timeFallback: "< 1m",
		className:
			"border-red-200/70 hover:border-red-300 hover:bg-red-50/70 hover:text-red-700",
	},
	{
		key: "hard",
		label: "Hard",
		timeFallback: "2d",
		className:
			"border-orange-200/70 hover:border-orange-300 hover:bg-orange-50/70 hover:text-orange-700",
	},
	{
		key: "good",
		label: "Good",
		timeFallback: "5d",
		className:
			"border-emerald-200/70 hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-emerald-700",
	},
	{
		key: "easy",
		label: "Easy",
		timeFallback: "8d",
		className:
			"border-sky-200/70 hover:border-sky-300 hover:bg-sky-50/70 hover:text-sky-700",
	},
] as const;

const REVIEW_STATE_LABELS: Record<string, string> = {
	new: "New",
	learning: "Learning",
	review: "To Review",
	mastered: "Mastered",
};

export function VocabularyReviewSession({
	category,
	items,
}: VocabularyReviewSessionProps) {
	const [index, setIndex] = useState(0);
	const [isRevealed, setIsRevealed] = useState(false);

	const current = items[index];
	const total = items.length;
	const progressPercent = total > 0 ? ((index + 1) / total) * 100 : 0;

	const stateStats = useMemo(() => {
		const counts = {
			new: 0,
			learning: 0,
			review: 0,
			mastered: 0,
		};

		for (const item of items) {
			const state = item.review?.state ?? "new";
			if (state in counts) {
				counts[state as keyof typeof counts] += 1;
			}
		}

		return [
			{ key: "new", color: "bg-sky-500", value: counts.new },
			{ key: "learning", color: "bg-orange-500", value: counts.learning },
			{ key: "review", color: "bg-emerald-500", value: counts.review },
			{ key: "mastered", color: "bg-violet-500", value: counts.mastered },
		];
	}, [items]);

	const nextCard = () => {
		setIndex((old) => Math.min(old + 1, Math.max(total - 1, 0)));
		setIsRevealed(false);
	};

	if (!current) {
		return (
			<div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
				<p className="font-medium text-neutral-900">No cards due now</p>
				<p className="mt-2 text-neutral-500 text-sm">
					Great job. You are done for this category.
				</p>
				<Button asChild className="mt-5">
					<Link
						to="/app/vocabularies/$slug"
						params={{ slug: category.slug }}
						search={{ page: 1 }}
					>
						Back to category
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
				<div>
					<div className="mb-1.5 flex items-center gap-2">
						<span className="size-1.5 rounded-full bg-emerald-500" />
						<span className="font-medium text-[10px] text-neutral-500 uppercase tracking-[0.16em]">
							{category.name}
						</span>
					</div>
					<h2 className="font-medium text-2xl text-neutral-900 tracking-tight">
						Daily Review
					</h2>
				</div>
				<div className="min-w-44">
					<div className="mb-1.5 flex items-center justify-end gap-2 font-mono text-neutral-400 text-xs">
						<span className="text-neutral-900">{index + 1}</span>
						<span>/</span>
						<span>{total}</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
						<div
							className="h-full rounded-full bg-neutral-900 transition-all"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
				</div>
			</div>

			<div className="grid items-start gap-6 lg:grid-cols-[1fr_250px]">
				<div className="space-y-5">
					<div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-10">
						<div className="mb-7 flex w-full items-center justify-center">
							<span className="inline-flex rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-medium text-[10px] text-neutral-600 uppercase tracking-[0.12em]">
								{current.type}
							</span>
						</div>

						<div className="space-y-3 text-center">
							<h3 className="font-medium text-4xl text-neutral-900 tracking-tight md:text-5xl">
								{current.name}
							</h3>
							<p className="font-mono text-neutral-400 text-sm">
								{current.collection?.uk.spell ||
									current.collection?.us.spell ||
									""}
							</p>
						</div>

						<div className="my-8 border-neutral-100 border-t" />

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
									onClick={() => setIsRevealed(true)}
								>
									Show meaning
								</Button>
							</div>
						)}
					</div>

					<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
						{GRADES.map((grade) => {
							const intervalLabel =
								current.preview?.[grade.key]?.intervalLabel ??
								grade.timeFallback;

							return (
								<button
									key={grade.key}
									type="button"
									disabled={!isRevealed}
									onClick={nextCard}
									className={cn(
										"rounded-lg border bg-white px-3 py-3 text-left transition-all",
										"disabled:cursor-not-allowed disabled:opacity-45",
										grade.className,
									)}
								>
									<div className="font-medium text-sm">{grade.label}</div>
									<div className="mt-1 font-mono text-[11px] text-neutral-500">
										{intervalLabel}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				<aside className="space-y-4">
					<div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
						<div className="mb-4 flex items-center justify-between">
							<h4 className="font-medium text-neutral-900 text-sm">
								Session Stats
							</h4>
							<div className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-medium text-[11px] text-neutral-600">
								<FireIcon className="size-3 text-orange-500" weight="duotone" />
								12
							</div>
						</div>
						<div className="space-y-3">
							{stateStats.map((item) => (
								<div
									key={item.key}
									className="flex items-center justify-between text-xs"
								>
									<div className="flex items-center gap-2 text-neutral-500">
										<span className={cn("size-2 rounded-sm", item.color)} />
										{REVIEW_STATE_LABELS[item.key]}
									</div>
									<span className="font-mono text-neutral-800">
										{item.value}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
						<h4 className="mb-3 font-medium text-neutral-900 text-sm">
							Actions
						</h4>
						<div className="space-y-2">
							<Button
								variant="outline"
								className="w-full justify-start"
								onClick={() => setIsRevealed((old) => !old)}
							>
								{isRevealed ? "Hide answer" : "Reveal answer"}
							</Button>
							<Button
								asChild
								variant="outline"
								className="w-full justify-start"
							>
								<Link
									to="/app/vocabularies/$slug"
									params={{ slug: category.slug }}
									search={{ page: 1 }}
								>
									Back to list
								</Link>
							</Button>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
