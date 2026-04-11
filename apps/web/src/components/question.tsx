import { FlagIcon } from "@phosphor-icons/react";
import type { QuestionWithSubs } from "@trektoeic/schemas/question-schema";
import { useMount } from "ahooks";
import {
	createContext,
	type ReactNode,
	use,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { cn } from "@/lib/utils";
import { getProxiedAudioUrl, getProxiedImageUrl } from "@/utils/proxy-image";
import { AnswerExplanationCollapsible } from "./answer-explanation-collapsible";
import { iconBadgeVariants } from "./icon-badge";
import { ImageZoom } from "./kibo-ui/image-zoom";
import { QuestionOption } from "./question-option";
import {
	AudioPlayerButton,
	AudioPlayerDuration,
	AudioPlayerProgress,
	AudioPlayerProvider,
	AudioPlayerSpeed,
	AudioPlayerTime,
	useAudioPlayer,
} from "./ui/audio-player";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const PART_WITHOUT_TEXT = new Set([1, 2]);
const PART_WITHOUT_SUB_POS = new Set([1, 2, 5]);
const PART_NOT_SHOW_TEASER = new Set([1, 2, 3, 4]);
const PART_TEASER_REVEAL_ON_REVIEW = new Set([3, 4]);
const PART_TEASER_TRANSLATION = new Set([3, 4, 6, 7]);
const PART_TEASER_TAB_LAYOUT = new Set([3, 4, 6, 7]);
const READING_PARTS = new Set([6, 7]);

const sanitizeQuestionHtml = (value?: string | null) =>
	(value ?? "")
		.replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, "")
		.replace(/<p[^>]*>\s*<\/p>/gi, "")
		.replace(/<br\s*\/?>/gi, "\n");

const hasRenderableQuestionHtml = (value: string) =>
	value.replace(/<[^>]+>/g, " ").trim().length > 0;

type TQuestionContext = {
	question: QuestionWithSubs;
};

type QuestionViewMode = "practice" | "review" | "exam";

export const QuestionContext = createContext<TQuestionContext | null>(null);

function useControllableState<T>({
	prop,
	defaultProp,
	onChange,
}: {
	prop: T | undefined;
	defaultProp: T;
	onChange?: (value: T) => void;
}) {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultProp);
	const isControlled = prop !== undefined;
	const value = isControlled ? prop : uncontrolledValue;

	const setValue = useCallback(
		(nextValue: T | ((prevValue: T) => T)) => {
			const resolvedValue =
				typeof nextValue === "function"
					? (nextValue as (prevValue: T) => T)(value)
					: nextValue;

			if (!isControlled) {
				setUncontrolledValue(resolvedValue);
			}

			if (!Object.is(value, resolvedValue)) {
				onChange?.(resolvedValue);
			}
		},
		[isControlled, onChange, value],
	);

	return [value, setValue] as const;
}

export const useQuestionContext = () => {
	const context = use(QuestionContext);

	if (!context) {
		throw new Error(
			"useQuestionContext must be used within a QuestionProvider",
		);
	}

	return context;
};

export const QuestionProvider = ({
	question,
	children,
}: {
	question: QuestionWithSubs;
	children: ReactNode;
}) => {
	if (!question) {
		return null;
	}

	return (
		<QuestionContext.Provider value={{ question }}>
			{children}
		</QuestionContext.Provider>
	);
};

export const QuestionPos = ({ externalPos }: { externalPos?: string }) => {
	const { question } = useQuestionContext();

	const pos = useMemo(() => {
		if (externalPos) {
			return externalPos;
		}

		return question.subs.length > 1
			? [
					question.subs[0].position,
					question.subs[question.subs.length - 1].position,
				].join(" - ")
			: `${question.subs[0].position}`;
	}, [question, externalPos]);

	return (
		<span className="inline-flex items-center justify-center rounded border border-neutral-200 bg-neutral-100 px-2 py-1 font-bold text-[10px] text-neutral-500">
			Q. {pos}
		</span>
	);
};

export const QuestionFlagButton = ({
	isAdded,
	onToggle,
}: {
	isAdded?: boolean;
	onToggle?: () => void;
}) => {
	return (
		<button
			className={cn(
				iconBadgeVariants({
					color: isAdded ? "yellow" : "slate",
				}),
				"size-8 cursor-pointer rounded-md hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
			)}
			onClick={onToggle}
			aria-label={isAdded ? "Bỏ đánh dấu" : "Đánh dấu"}
			type="button"
		>
			<FlagIcon className="size-4" weight="duotone" />
		</button>
	);
};

export const QuestionAudio = ({
	onComplete,
	disableSeek = false,
	disableSpeed = false,
}: {
	onComplete?: () => void;
	disableSeek?: boolean;
	disableSpeed?: boolean;
}) => {
	const { question } = useQuestionContext();

	if (!question?.audioUrl) {
		return null;
	}

	return (
		<AudioPlayerProvider key={question.id}>
			<QuestionAudioContent
				onComplete={onComplete}
				disableSeek={disableSeek}
				disableSpeed={disableSpeed}
			/>
		</AudioPlayerProvider>
	);
};

const QuestionAudioContent = ({
	onComplete,
	disableSeek = false,
	disableSpeed = false,
}: {
	onComplete?: () => void;
	disableSeek?: boolean;
	disableSpeed?: boolean;
}) => {
	const player = useAudioPlayer();
	const { question } = useQuestionContext();

	useEffect(() => {
		const onEnded = () => {
			onComplete?.();
		};

		player.ref.current?.addEventListener("ended", onEnded);

		return () => {
			player.ref.current?.removeEventListener("ended", onEnded);
		};
	}, [
		onComplete,
		player.ref.current?.addEventListener,
		player.ref.current?.removeEventListener,
	]);

	useMount(() => {
		player.play({
			id: question.id,
			src: getProxiedAudioUrl(question?.audioUrl) as string,
		});
	});

	if (!question?.audioUrl) {
		return null;
	}

	return (
		<div className="flex items-center gap-3 rounded-md border border-border bg-white p-2">
			<AudioPlayerButton
				variant="outline"
				size="default"
				className="size-9 shrink-0"
			/>
			<div className="flex flex-1 items-center gap-3">
				<AudioPlayerTime className="text-xs tabular-nums" />
				<AudioPlayerProgress className="flex-1" disabled={disableSeek} />
				<AudioPlayerDuration className="text-xs tabular-nums" />
				<AudioPlayerSpeed
					variant="ghost"
					size="icon"
					className="size-9"
					disabled={disableSpeed}
				/>
			</div>
		</div>
	);
};

export const QuestionImage = ({
	mode = "exam",
	isReadyToReveal = false,
}: {
	mode?: QuestionViewMode;
	isReadyToReveal?: boolean;
}) => {
	const { question } = useQuestionContext();

	if (!question?.imageUrl) {
		return null;
	}

	const shouldRevealExtraContent =
		mode === "review" || (mode === "practice" && isReadyToReveal);
	const hasTranslation = hasRenderableQuestionHtml(
		sanitizeQuestionHtml(question?.teaser?.tran?.vi),
	);
	const shouldRenderInTabs =
		PART_TEASER_TAB_LAYOUT.has(question.part) &&
		hasTranslation &&
		shouldRevealExtraContent;

	if (shouldRenderInTabs) {
		return null;
	}

	const urls = question.imageUrl.split(",");

	if (urls.length > 1) {
		return (
			<div className="grid grid-cols-1 gap-4">
				{urls.map((url, index) => (
					<ImageZoom
						key={url}
						backdropClassName={cn(
							'[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80',
						)}
					>
						<img
							alt={`Hình ảnh cho câu hỏi ${question.id} - ${index + 1}`}
							className={cn("mx-auto h-80 w-auto rounded-md object-contain", {
								"h-auto": READING_PARTS.has(question.part),
							})}
							src={getProxiedImageUrl(url)}
						/>
					</ImageZoom>
				))}
			</div>
		);
	}

	return (
		<ImageZoom
			backdropClassName={cn(
				'[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80',
			)}
		>
			<img
				alt={`Hình ảnh cho câu hỏi ${question.id}`}
				className={cn("mx-auto h-80 w-auto rounded-md object-contain", {
					"h-auto": READING_PARTS.has(question.part),
				})}
				src={getProxiedImageUrl(question.imageUrl)}
			/>
		</ImageZoom>
	);
};

export const QuestionTeaser = ({
	mode = "exam",
	isReadyToReveal = false,
}: {
	mode?: QuestionViewMode;
	isReadyToReveal?: boolean;
}) => {
	const { question } = useQuestionContext();

	const cleanedText = sanitizeQuestionHtml(question?.teaser?.text);
	const cleanedTranslation = sanitizeQuestionHtml(question?.teaser?.tran?.vi);
	const hasImage = !!question.imageUrl;

	const hasTeaser = hasRenderableQuestionHtml(cleanedText);
	const hasTranslation = hasRenderableQuestionHtml(cleanedTranslation);
	const shouldRevealExtraContent =
		mode === "review" || (mode === "practice" && isReadyToReveal);

	const shouldShowOriginal = (() => {
		if (PART_NOT_SHOW_TEASER.has(question.part)) {
			return false;
		}

		if (hasImage && shouldRevealExtraContent) {
			return true;
		}

		if (!hasTeaser) {
			return false;
		}

		if (PART_TEASER_REVEAL_ON_REVIEW.has(question.part)) {
			return shouldRevealExtraContent;
		}

		return !question.imageUrl;
	})();

	const shouldShowTranslation =
		PART_TEASER_TRANSLATION.has(question.part) &&
		hasTranslation &&
		shouldRevealExtraContent;

	if (!shouldShowOriginal && !shouldShowTranslation) {
		return null;
	}

	const proseClassName =
		"prose prose-neutral prose !max-w-full font-serif [&_p]:leading-relaxed";
	const teaserTitle = READING_PARTS.has(question.part) ? "Bài đọc" : "Teaser";

	if (
		PART_TEASER_TAB_LAYOUT.has(question.part) &&
		shouldShowOriginal &&
		shouldShowTranslation
	) {
		return (
			<Tabs defaultValue="original" className="rounded-lg border bg-white p-3">
				<TabsList>
					<TabsTrigger value="original">{teaserTitle}</TabsTrigger>
					<TabsTrigger value="translation">Bản dịch</TabsTrigger>
				</TabsList>
				<TabsContent value="original">
					<div className="space-y-4">
						{hasImage ? (
							<QuestionImage mode={mode} isReadyToReveal={false} />
						) : null}
						{hasTeaser ? (
							<div
								// biome-ignore lint/security/noDangerouslySetInnerHtml: <no>
								dangerouslySetInnerHTML={{
									__html: cleanedText,
								}}
								className={proseClassName}
							/>
						) : null}
					</div>
				</TabsContent>
				<TabsContent value="translation">
					<div
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <no>
						dangerouslySetInnerHTML={{
							__html: cleanedTranslation,
						}}
						className={proseClassName}
					/>
				</TabsContent>
			</Tabs>
		);
	}

	return (
		<div className="space-y-3">
			{shouldShowOriginal ? (
				<Card className="rounded-lg border bg-white ring-0">
					<CardContent className="py-4">
						<p className="mb-3 font-medium text-gray-900 text-sm">
							{teaserTitle}
						</p>
						<div className="space-y-4">
							{hasImage ? (
								<QuestionImage mode={mode} isReadyToReveal={false} />
							) : null}
							{hasTeaser ? (
								<div
									// biome-ignore lint/security/noDangerouslySetInnerHtml: <no>
									dangerouslySetInnerHTML={{
										__html: cleanedText,
									}}
									className={proseClassName}
								/>
							) : null}
						</div>
					</CardContent>
				</Card>
			) : null}
			{shouldShowTranslation ? (
				<Card className="rounded-lg border bg-white ring-0">
					<CardContent className="py-4">
						<p className="mb-3 font-medium text-gray-900 text-sm">Bản dịch</p>
						<div
							// biome-ignore lint/security/noDangerouslySetInnerHtml: <no>
							dangerouslySetInnerHTML={{
								__html: cleanedTranslation,
							}}
							className={proseClassName}
						/>
					</CardContent>
				</Card>
			) : null}
		</div>
	);
};

const QuestionSubContext = createContext<{
	sub: QuestionWithSubs["subs"][number];
} | null>(null);

const useQuestionSubContext = () => {
	const context = use(QuestionSubContext);
	if (!context) {
		throw new Error(
			"useQuestionSubContext must be used within a QuestionSubProvider",
		);
	}
	return context;
};

export const QuestionSubs = ({
	children,
	classNames,
	ref,
}: {
	children:
		| ((props: { index: number; subQuestionId: string }) => ReactNode)
		| ReactNode;
	classNames?: {
		wrapper?: string;
		item?: string;
	};
	ref?: React.Ref<HTMLDivElement>;
}) => {
	const { question } = useQuestionContext();

	return (
		<div className={cn("space-y-8", classNames?.wrapper)} ref={ref}>
			{question?.subs.map((sub, idx) => (
				<QuestionSubContext.Provider key={sub.id} value={{ sub }}>
					<div
						id={`question-sub-${sub.id}`}
						className={cn(
							"rounded-md border border-transparent p-1 transition-all data-[highlighted=true]:border-indigo-600",
							classNames?.item,
						)}
					>
						{typeof children === "function"
							? children({
									index: idx,
									subQuestionId: sub.id,
								})
							: children}
					</div>
				</QuestionSubContext.Provider>
			))}
		</div>
	);
};

export const QuestionSubText = ({
	externalPos,
	flag,
}: {
	externalPos?: string;
	flag?: ReactNode;
}) => {
	const { sub } = useQuestionSubContext();
	const { question } = useQuestionContext();

	const content = useMemo(() => {
		if (PART_WITHOUT_SUB_POS.has(question.part)) {
			if (PART_WITHOUT_TEXT.has(question.part)) {
				return "";
			}

			return sub.question.replace(/^\d+[.)\-:]?\s*/, "");
		}

		if (PART_WITHOUT_TEXT.has(question.part)) {
			if (externalPos) {
				return `${externalPos}.`;
			}

			return `${sub.position}.`;
		}

		return sub.question.replace(/^\d+[.)\-:]?\s*/, "");
	}, [sub, question, externalPos]);

	const isShowPos = !PART_WITHOUT_SUB_POS.has(question.part);

	return isShowPos || content ? (
		<div className="space-y-2">
			{isShowPos ? (
				<div className="flex items-center justify-between">
					<span className="inline-flex items-center justify-center rounded border border-neutral-200 bg-neutral-100 px-2 py-1 font-bold text-[10px] text-neutral-500">
						Q. {externalPos ?? sub.position}
					</span>
					{flag}
				</div>
			) : null}
			{content ? (
				<p className="text-neutral-700 text-sm leading-relaxed">{content}</p>
			) : null}
		</div>
	) : null;
};

export const QuestionSubOptions = ({
	onValueChange,
	value,
	mode,
	isDisabledAfterSelect = false,
}: {
	onValueChange?: (
		opts: {
			choice: string;
			questionId: string;
			subQuestionId: string;
			isCorrect?: boolean;
		} | null,
	) => void;
	value?: {
		choice: string;
		questionId: string;
		subQuestionId: string;
		isCorrect?: boolean;
	} | null;
	mode: "practice" | "review" | "exam";
	isDisabledAfterSelect?: boolean;
}) => {
	const { sub } = useQuestionSubContext();
	const { question } = useQuestionContext();

	const [internal, setInternal] = useControllableState({
		defaultProp: null,
		prop: value,
		onChange: onValueChange,
	});

	const isDisabled = useMemo(
		() => (isDisabledAfterSelect && !!internal?.choice) || mode === "review",
		[isDisabledAfterSelect, mode, internal?.choice],
	);

	const isCorrectAnswerAvailable = useCallback(
		(choice: string) => {
			if (mode === "exam") {
				return false;
			}

			if (!sub.ans) {
				return false;
			}

			if (mode === "review") {
				return choice.startsWith(sub.ans);
			}

			if (!internal?.choice) {
				return false;
			}

			return choice.startsWith(sub.ans);
		},
		[mode, sub.ans, internal],
	);

	const isChooseCorrectAnswer = useCallback(
		(choice: string) => {
			if (!internal) {
				return false;
			}

			if (!internal.choice) {
				return false;
			}

			if (mode === "exam") {
				return false;
			}

			return internal.choice === choice && internal.choice.startsWith(sub.ans);
		},
		[mode, sub.ans, internal],
	);

	const isChooseWrongAnswer = useCallback(
		(choice: string) => {
			if (mode === "exam") {
				return false;
			}

			if (!internal) {
				return false;
			}

			if (!internal.choice) {
				return false;
			}

			return (
				internal.choice === choice && !internal.choice.startsWith(sub.ans ?? "")
			);
		},
		[sub.ans, internal, mode],
	);

	const handleToggleOption = (optionKey: string) => {
		if (isDisabled) {
			return;
		}

		if (mode === "review") {
			return;
		}

		if (mode === "exam") {
			setInternal({
				choice: optionKey,
				questionId: question.id,
				subQuestionId: sub.id,
				isCorrect: optionKey === sub.ans,
			});
			return;
		}

		if (internal?.choice === optionKey) {
			setInternal(null);
		} else {
			setInternal({
				choice: optionKey,
				questionId: question.id,
				subQuestionId: sub.id,
				isCorrect: optionKey === sub.ans,
			});
		}
	};

	const isChecked =
		mode === "review" || (mode === "practice" && !!internal?.choice);

	const getValueForRender = (value: string) => {
		if (mode === "review") {
			return value;
		}

		if (mode === "practice") {
			if (PART_WITHOUT_TEXT.has(question.part) && internal?.choice) {
				return value;
			}

			return PART_WITHOUT_TEXT.has(question.part) ? "" : value;
		}

		return PART_WITHOUT_TEXT.has(question.part) ? "" : value;
	};

	return (
		<ul className="flex flex-col gap-2">
			{Object.entries(sub.options).map(([key, value]) => {
				const isSelected = internal?.choice === key;
				const isCorrect =
					isCorrectAnswerAvailable(key) || isChooseCorrectAnswer(key);
				const isWrong = isChooseWrongAnswer(key);

				return (
					<li key={key}>
						<QuestionOption
							label={key.toUpperCase()}
							value={getValueForRender(value)}
							isSelected={isSelected}
							isCorrect={isCorrect}
							isWrong={isWrong}
							isChecked={isChecked}
							onClick={() => handleToggleOption(key)}
							disabled={isDisabled}
						/>
					</li>
				);
			})}
		</ul>
	);
};

export const QuestionSubExplanation = ({
	mode,
	isAnswerSelected,
	defaultOpen = false,
	answerCorrect,
}: {
	mode: "practice" | "review" | "exam";
	isAnswerSelected?: boolean;
	defaultOpen?: boolean;
	/** Khi biết đúng/sai (luyện tập / xem lại) — tô màu khối giải thích tương ứng. */
	answerCorrect?: boolean;
}) => {
	const { sub } = useQuestionSubContext();

	if (!sub.translation || Object.keys(sub.translation).length === 0) {
		return null;
	}

	// Only show explanation when:
	// - In review mode (always)
	// - In practice mode after this sub question is answered
	// - Never in exam mode
	const shouldShow =
		mode === "review" || (mode === "practice" && isAnswerSelected);

	if (!shouldShow) {
		return null;
	}

	const tone =
		answerCorrect === true
			? "correct"
			: answerCorrect === false
				? "wrong"
				: "neutral";

	return (
		<AnswerExplanationCollapsible tone={tone} defaultOpen={defaultOpen}>
			<div
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation content>
				dangerouslySetInnerHTML={{
					__html: sub.translation.vi as string,
				}}
				className="prose prose-sm prose-neutral max-w-none whitespace-break-spaces text-sm leading-relaxed [&_li]:text-neutral-700 [&_p]:my-2 [&_p]:text-neutral-700 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_strong]:font-semibold [&_strong]:text-neutral-900 [&_ul]:my-2 [&_ul]:space-y-1"
			/>
		</AnswerExplanationCollapsible>
	);
};
