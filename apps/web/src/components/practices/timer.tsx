import { TimerIcon } from "@phosphor-icons/react";
import { useCountDown } from "ahooks";
import { cva } from "class-variance-authority";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useCountUpMs } from "@/hooks/use-count-up";
import { dayjs } from "@/lib/dayjs";
import { cn } from "@/lib/utils";

export type TimerRef = {
	/** Get current elapsed time in milliseconds */
	getElapsed: () => number;
	/** Get current remaining time in milliseconds (countdown mode only) */
	getRemaining: () => number;
	/** Get formatted time string (mm:ss) */
	getFormatted: () => string;
	/** Reset timer (count up mode only) */
	reset: () => void;
};

type TimerProps = {
	className?: string;
	/** Callback fired when timer value changes (every second) */
	onChange?: (elapsed: number) => void;
};

type TimerUpProps = {} & TimerProps;

type TimerDownProps = {
	duration: number;
	onDone: () => void;
} & TimerProps;

type Props = (
	| (TimerUpProps & { mode: "up" })
	| (TimerDownProps & { mode: "down" })
) &
	TimerProps;

const timerVariants = cva(
	"flex min-w-[93px] items-center gap-2 rounded-full border border-border bg-neutral-100 px-3 py-1.5 text-primary text-sm",
);

export const Timer = forwardRef<TimerRef, Props>((props, ref) => {
	if (props.mode === "up") {
		const { className, onChange } = props;
		return (
			<TimerUp
				ref={ref}
				className={timerVariants({
					className,
				})}
				onChange={onChange}
			/>
		);
	}

	const { onDone, className, duration, onChange } = props;

	return (
		<TimerDown
			ref={ref}
			onDone={onDone}
			className={timerVariants({
				className,
			})}
			duration={duration}
			onChange={onChange}
		/>
	);
});

const TimerUp = forwardRef<TimerRef, TimerUpProps>(
	({ className, onChange }, ref) => {
		const { elapsedMs, reset } = useCountUpMs({
			startMs: 0,
			autoStart: true,
		});

		useImperativeHandle(
			ref,
			() => ({
				getElapsed: () => elapsedMs,
				getRemaining: () => 0,
				getFormatted: () => dayjs.duration(elapsedMs).format("mm:ss"),
				reset,
			}),
			[elapsedMs, reset],
		);

		useEffect(() => {
			onChange?.(elapsedMs);
		}, [elapsedMs, onChange]);

		return (
			<div className={cn(className)}>
				<TimerIcon className="size-5 text-indigo-700" weight="duotone" />
				<span>{dayjs.duration(elapsedMs).format("mm:ss")}</span>
			</div>
		);
	},
);

const TimerDown = forwardRef<TimerRef, TimerDownProps>(
	({ onDone, className, duration, onChange }, ref) => {
		const [countdown] = useCountDown({
			leftTime: duration,
			onEnd: onDone,
		});

		const elapsed = duration - countdown;

		useImperativeHandle(
			ref,
			() => ({
				getElapsed: () => elapsed,
				getRemaining: () => countdown,
				getFormatted: () => dayjs.duration(countdown).format("mm:ss"),
				reset: () => {
					// Not implemented for countdown mode
				},
			}),
			[elapsed, countdown],
		);

		useEffect(() => {
			onChange?.(elapsed);
		}, [elapsed, onChange]);

		return (
			<div className={cn(className)}>
				<TimerIcon className="size-5 text-indigo-700" weight="duotone" />
				<span>{dayjs.duration(countdown).format("mm:ss")}</span>
			</div>
		);
	},
);

TimerUp.displayName = "TimerUp";
TimerDown.displayName = "TimerDown";
Timer.displayName = "Timer";
