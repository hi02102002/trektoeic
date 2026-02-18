import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getYoudaoDictVoiceUrl } from "@trektoeic/utils/get-youdao-dictvoice-url";
import { Suspense } from "react";
import { AudioPlayButton } from "@/components/audio-play-button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { orpc } from "@/lib/orpc/orpc";
import { cn } from "@/lib/utils";

type VocabularyReviewDunnoDetailDrawerProps = {
	keyword: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const toStringArray = (value: unknown): string[] => {
	if (!Array.isArray(value)) return [];
	return value.filter((item): item is string => typeof item === "string");
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const parseSnym = (value: unknown): string[] => {
	if (!value) return [];
	if (typeof value === "string") return [value];

	if (Array.isArray(value)) {
		return value.flatMap((item) => parseSnym(item));
	}

	if (!isRecord(value)) return [];

	const words = typeof value.word === "string" ? [value.word] : [];
	const content = toStringArray(value.content);
	return [...words, ...content];
};

export function VocabularyReviewDunnoDetailDrawer({
	keyword,
	open,
	onOpenChange,
}: VocabularyReviewDunnoDetailDrawerProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-lg">
				<SheetHeader className="text-left">
					<SheetTitle>
						Chi tiết từ: <span className="text-primary">{keyword}</span>
					</SheetTitle>
					<SheetDescription className="sr-only">
						Chi tiet nghia va vi du tu Dunno.
					</SheetDescription>
				</SheetHeader>

				<div className="mx-auto w-full max-w-3xl space-y-4 overflow-y-auto px-4 pb-6">
					{open ? (
						<Suspense fallback={<VocabularyReviewDunnoDetailSkeleton />}>
							<VocabularyReviewDunnoDetailContent keyword={keyword} />
						</Suspense>
					) : null}
				</div>
			</SheetContent>
		</Sheet>
	);
}

function VocabularyReviewDunnoDetailSkeleton() {
	const cardStyle = useCardStyle();

	return (
		<div className="space-y-4">
			<div className={cn(cardStyle, "h-auto justify-start space-y-3 p-4")}>
				<Skeleton className="h-6 w-48" />
				<Skeleton className="h-4 w-72" />
			</div>

			<div className={cn(cardStyle, "h-auto justify-start space-y-3 p-4")}>
				<Skeleton className="h-5 w-24" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<Skeleton className="h-16 w-full rounded-lg" />
			</div>

			<div className={cn(cardStyle, "h-auto justify-start space-y-3 p-4")}>
				<Skeleton className="h-5 w-28" />
				<div className="flex flex-wrap gap-2">
					<Skeleton className="h-8 w-20 rounded-md" />
					<Skeleton className="h-8 w-24 rounded-md" />
					<Skeleton className="h-8 w-16 rounded-md" />
				</div>
			</div>
		</div>
	);
}

function VocabularyReviewDunnoDetailContent({ keyword }: { keyword: string }) {
	const cardStyle = useCardStyle();
	const { data: dunnoDetail } = useSuspenseQuery(
		orpc.vocabularies.getDunnoDetail.queryOptions({
			input: { keyword },
		}),
	);

	if (!dunnoDetail) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<MagnifyingGlassIcon className="size-5" />
					</EmptyMedia>
					<EmptyTitle>Không tìm thấy chi tiết cho từ này.</EmptyTitle>
					<EmptyDescription>
						Hiện tại Dunno chưa có dữ liệu cho từ này.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	const synonyms = Array.from(new Set(parseSnym(dunnoDetail.snym)));
	const pronounceText =
		dunnoDetail.pronounce?.gb && dunnoDetail.pronounce?.us
			? `GB: ${dunnoDetail.pronounce.gb} | US: ${dunnoDetail.pronounce.us}`
			: dunnoDetail.pronounce?.gb
				? `GB: ${dunnoDetail.pronounce.gb}`
				: dunnoDetail.pronounce?.us
					? `US: ${dunnoDetail.pronounce.us}`
					: dunnoDetail.pronounce?.base || "--";

	return (
		<div className="space-y-4">
			<div className={cn(cardStyle, "h-auto justify-start space-y-2 p-4")}>
				<div className="flex items-center gap-2">
					<p className="font-semibold text-lg">{dunnoDetail.word}</p>
					<AudioPlayButton
						className="size-7"
						src={getYoudaoDictVoiceUrl(dunnoDetail.word)}
						ariaLabel="Play vocabulary word"
					/>
				</div>
				<p className="mt-2 text-muted-foreground text-sm">{pronounceText}</p>
			</div>

			{dunnoDetail.content.map((contentItem, idx) => (
				<div
					key={`${contentItem.kind}-${idx}`}
					className={cn(cardStyle, "h-auto justify-start space-y-3 p-4")}
				>
					<p className="font-semibold text-base">{contentItem.kind}</p>
					<div className="space-y-3">
						{contentItem.means.map((meanItem, meanIdx) => (
							<div
								key={`${contentItem.kind}-mean-${meanIdx}`}
								className="space-y-2"
							>
								<p className="text-[15px] leading-relaxed">{meanItem.mean}</p>
								{meanItem.examples.length > 0 ? (
									<div className="space-y-2 rounded-md bg-neutral-50 p-3">
										{meanItem.examples.map((example) => (
											<div
												key={`${example._id}-${example.id}`}
												className="space-y-1"
											>
												<div className="flex items-center gap-1.5">
													<p className="text-sm italic leading-relaxed">
														{example.e}
													</p>
													<AudioPlayButton
														className="size-6 shrink-0"
														iconClassName="size-3.5"
														src={getYoudaoDictVoiceUrl(example.e)}
														ariaLabel="Play example sentence"
													/>
												</div>
												<p className="text-muted-foreground text-sm leading-relaxed">
													{example.m}
												</p>
											</div>
										))}
									</div>
								) : null}
							</div>
						))}
					</div>
				</div>
			))}

			{dunnoDetail.word_family.length > 0 ? (
				<div className={cn(cardStyle, "h-auto justify-start space-y-3 p-4")}>
					<p className="font-semibold text-base">Word family</p>
					<div className="space-y-3">
						{dunnoDetail.word_family.map((family) => {
							const label = family.field || family.kind || "group";
							const familyKey = `${label}-${family.p.join("|")}-${family.content.join("|")}`;
							return (
								<div key={familyKey} className="space-y-2">
									<p className="text-muted-foreground text-xs uppercase">
										{label}
									</p>
									{family.p.length > 0 ? (
										<p className="text-muted-foreground text-sm">
											{family.p.join(" | ")}
										</p>
									) : null}
									<div className="flex flex-wrap gap-2">
										{family.content.map((item) => (
											<span
												key={`${label}-${item}`}
												className="rounded-md bg-neutral-100 px-2.5 py-1 text-sm"
											>
												{item}
											</span>
										))}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			) : null}

			{synonyms.length > 0 ? (
				<div className={cn(cardStyle, "h-auto justify-start space-y-3 p-4")}>
					<p className="font-semibold text-base">Synonyms</p>
					<div className="flex flex-wrap gap-2">
						{synonyms.map((item) => (
							<span
								key={item}
								className="rounded-md bg-neutral-100 px-2.5 py-1 text-sm"
							>
								{item}
							</span>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
}
