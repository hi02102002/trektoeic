import { CaretDown, FlagIcon } from "@phosphor-icons/react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import type { QuestionWithSubs } from "@trektoeic/schemas/question-schema";
import { useMount } from "ahooks";
import {
	createContext,
	type ReactNode,
	use,
	useCallback,
	useEffect,
	useMemo,
} from "react";
import { cn } from "@/lib/utils";
import { getProxiedAudioUrl, getProxiedImageUrl } from "@/utils/proxy-image";
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
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/collapsible";

const PART_WITHOUT_TEXT = new Set([1, 2]);
const PART_WITHOUT_SUB_POS = new Set([1, 2, 5]);
const PART_NOT_SHOW_TEASER = new Set([1, 2, 3, 4]);

type TQuestionContext = {
	question: QuestionWithSubs;
};

export const QuestionContext = createContext<TQuestionContext | null>(null);

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

export const QuestionAudio = ({ onComplete }: { onComplete?: () => void }) => {
	const { question } = useQuestionContext();

	if (!question?.audioUrl) {
		return null;
	}

	return (
		<AudioPlayerProvider key={question.id}>
			<QuestionAudioContent onComplete={onComplete} />
		</AudioPlayerProvider>
	);
};

const QuestionAudioContent = ({ onComplete }: { onComplete?: () => void }) => {
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
				<AudioPlayerProgress className="flex-1" />
				<AudioPlayerDuration className="text-xs tabular-nums" />
				<AudioPlayerSpeed variant="ghost" size="icon" className="size-9" />
			</div>
		</div>
	);
};

export const QuestionImage = () => {
	const { question } = useQuestionContext();

	if (!question?.imageUrl || question?.teaser?.text) {
		return null;
	}

	return (
		<ImageZoom
			backdropClassName={cn(
				'[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80',
			)}
		>
			<img
				alt={`Hình ảnh cho câu hỏi ${question.id}`}
				className="mx-auto h-80 w-auto rounded-md object-contain"
				src={getProxiedImageUrl(question.imageUrl)}
			/>
		</ImageZoom>
	);
};

export const QuestionTeaser = () => {
	const { question } = useQuestionContext();

	if (PART_NOT_SHOW_TEASER.has(question.part)) {
		return null;
	}

	if (!question?.teaser?.text) {
		return null;
	}

	const cleanedText = question.teaser.text
		.replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, "")
		.replace(/<p[^>]*>\s*<\/p>/gi, "")
		.replace(/<br\s*\/?>/gi, "\n");

	return (
		<div
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <no>
			dangerouslySetInnerHTML={{
				__html: cleanedText,
			}}
			className="prose prose-neutral prose !max-w-full font-serif"
		/>
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
				<p className="font-medium text-base text-primary leading-relaxed">
					{content}
				</p>
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

	return (
		<ul className="space-y-1">
			{Object.entries(sub.options).map(([key, value]) => {
				const isSelected = internal?.choice === key;
				const isCorrect =
					isCorrectAnswerAvailable(key) || isChooseCorrectAnswer(key);
				const isWrong = isChooseWrongAnswer(key);

				return (
					<li key={key}>
						<QuestionOption
							label={key.toUpperCase()}
							value={PART_WITHOUT_TEXT.has(question.part) ? "" : value}
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
}: {
	mode: "practice" | "review" | "exam";
	isAnswerSelected?: boolean;
	defaultOpen?: boolean;
}) => {
	const { sub } = useQuestionSubContext();

	if (!sub.translation || Object.keys(sub.translation).length === 0) {
		return null;
	}

	// Only show explanation when:
	// - In review mode (always)
	// - In practice mode after an answer is selected
	// - Never in exam mode
	const shouldShow =
		mode === "review" || (mode === "practice" && isAnswerSelected);

	if (!shouldShow) {
		return null;
	}

	return (
		<Collapsible defaultOpen={defaultOpen}>
			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
				<CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between overflow-hidden px-4 py-3 transition-colors hover:bg-gray-50">
					<h3 className="font-medium text-gray-900 text-sm">
						Giải thích đáp án
					</h3>
					<CaretDown
						className="size-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180"
						weight="bold"
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="border-gray-100 border-t px-4 py-3">
						<div
							// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation content>
							dangerouslySetInnerHTML={{
								__html: sub.translation.vi as string,
							}}
							className="prose prose-sm prose-neutral max-w-none whitespace-break-spaces text-sm [&_li]:text-gray-700 [&_p]:text-gray-700 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:space-y-1.5"
						/>
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
};
