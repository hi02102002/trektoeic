import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
	/**
	 * Auto-start the timer on mount
	 */
	autoStart?: boolean;
	/**
	 * Total duration in seconds (for countdown mode)
	 */
	duration?: number;
	/**
	 * Callback when timer completes (countdown mode only)
	 */
	onComplete?: () => void;
	/**
	 * Callback on each tick
	 */
	onTick?: (elapsed: number) => void;
}

interface UseTimerReturn {
	/**
	 * Elapsed time in seconds
	 */
	elapsed: number;
	/**
	 * Remaining time in seconds (for countdown mode)
	 */
	remaining: number;
	/**
	 * Whether timer is running
	 */
	isRunning: boolean;
	/**
	 * Whether timer is paused
	 */
	isPaused: boolean;
	/**
	 * Whether countdown has completed
	 */
	isCompleted: boolean;
	/**
	 * Start or resume the timer
	 */
	start: () => void;
	/**
	 * Pause the timer
	 */
	pause: () => void;
	/**
	 * Reset the timer to 0
	 */
	reset: () => void;
	/**
	 * Stop and reset the timer
	 */
	stop: () => void;
}

export const useTimer = (options: UseTimerOptions = {}): UseTimerReturn => {
	const { autoStart = false, duration, onComplete, onTick } = options;

	const [elapsed, setElapsed] = useState(0);
	const [isRunning, setIsRunning] = useState(autoStart);
	const [isPaused, setIsPaused] = useState(false);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number>(Date.now());
	const pausedTimeRef = useRef<number>(0);

	const remaining = duration ? Math.max(0, duration - elapsed) : 0;
	const isCompleted = duration ? elapsed >= duration : false;

	const start = useCallback(() => {
		if (isCompleted) return;

		if (isPaused) {
			// Resume from pause
			startTimeRef.current = Date.now() - pausedTimeRef.current;
			setIsPaused(false);
		} else {
			// Fresh start
			startTimeRef.current = Date.now();
			pausedTimeRef.current = 0;
		}
		setIsRunning(true);
	}, [isPaused, isCompleted]);

	const pause = useCallback(() => {
		if (!isRunning || isPaused) return;

		pausedTimeRef.current = Date.now() - startTimeRef.current;
		setIsRunning(false);
		setIsPaused(true);
	}, [isRunning, isPaused]);

	const reset = useCallback(() => {
		setElapsed(0);
		startTimeRef.current = Date.now();
		pausedTimeRef.current = 0;
		setIsPaused(false);
	}, []);

	const stop = useCallback(() => {
		setIsRunning(false);
		setIsPaused(false);
		setElapsed(0);
		pausedTimeRef.current = 0;
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	useEffect(() => {
		if (isRunning && !isPaused) {
			intervalRef.current = setInterval(() => {
				const currentElapsed = Math.floor(
					(Date.now() - startTimeRef.current) / 1000,
				);
				setElapsed(currentElapsed);

				// Call onTick callback
				onTick?.(currentElapsed);

				// Check if countdown is complete
				if (duration && currentElapsed >= duration) {
					setIsRunning(false);
					if (intervalRef.current) {
						clearInterval(intervalRef.current);
						intervalRef.current = null;
					}
					onComplete?.();
				}
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isRunning, isPaused, duration, onComplete, onTick]);

	return {
		elapsed,
		remaining,
		isRunning,
		isPaused,
		isCompleted,
		start,
		pause,
		reset,
		stop,
	};
};
