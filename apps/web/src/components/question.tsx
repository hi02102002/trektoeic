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
import { ImageZoom } from "./kibo-ui/image-zoom";
import {
	AudioPlayerButton,
	AudioPlayerDuration,
	AudioPlayerProgress,
	AudioPlayerProvider,
	AudioPlayerSpeed,
	AudioPlayerTime,
	useAudioPlayer,
} from "./ui/audio-player";
import { Button } from "./ui/button";

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
			src: question?.audioUrl as string,
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
				src={question.imageUrl}
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

export const QuestionSubText = ({ externalPos }: { externalPos?: string }) => {
	const { sub } = useQuestionSubContext();
	const { question } = useQuestionContext();

	const renderContent = useCallback(() => {
		if (PART_WITHOUT_SUB_POS.has(question.part)) {
			return sub.question.replace(/^\d+\.\s*/, "");
		}

		if (PART_WITHOUT_TEXT.has(question.part)) {
			if (externalPos) {
				return `${externalPos}.`;
			}

			return `${sub.position}.`;
		}

		return sub.question.replace(/^\d+\.\s*/, "");
	}, [sub, question, externalPos]);

	return (
		<div className="space-y-2">
			{PART_WITHOUT_SUB_POS.has(question.part) ? null : (
				<span className="inline-flex items-center justify-center rounded border border-neutral-200 bg-neutral-100 px-2 py-1 font-bold text-[10px] text-neutral-500">
					Q. {externalPos ?? sub.position}
				</span>
			)}
			<p className="font-medium text-base text-primary leading-relaxed">
				{renderContent()}
			</p>
		</div>
	);
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

			if (!internal) {
				return false;
			}

			if (!internal.choice) {
				return false;
			}

			if (!sub.ans) {
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
			});
		}
	};

	return (
		<ul className="space-y-2">
			{Object.entries(sub.options).map(([key, value]) => {
				const isSelected = internal?.choice === key;

				return (
					<li key={key}>
						<Button
							variant="outline"
							className={cn("w-full select-none justify-start", {
								"!border-indigo-700 !bg-indigo/10 !text-indigo-700 focus-visible:ring-indigo-700":
									isSelected && mode === "exam",
								"!border-green-500 !bg-green-50 !text-green-700 focus-visible:ring-green-500":
									isCorrectAnswerAvailable(key) || isChooseCorrectAnswer(key),
								"!border-red-500 !bg-red-50 !text-red-700 focus-visible:ring-red-500":
									isChooseWrongAnswer(key),
								"pointer-events-none": isDisabled,
							})}
							data-is-correct={
								isCorrectAnswerAvailable(key) || isChooseCorrectAnswer(key)
									? "true"
									: undefined
							}
							data-selected={isSelected ? "true" : undefined}
							key={key}
							onClick={() => {
								handleToggleOption(key);
							}}
							disabled={isDisabled}
						>
							{key.toUpperCase()}.{" "}
							{PART_WITHOUT_TEXT.has(question.part) ? "" : value}
						</Button>
					</li>
				);
			})}
		</ul>
	);
};
