import { useEffect, useRef, useState } from "react";

export function useCountUpMs({ startMs = 0, autoStart = true } = {}) {
	const [elapsedMs, setElapsedMs] = useState(startMs);

	const startTimeRef = useRef<number | null>(null);
	const rafRef = useRef<number | null>(null);
	const runningRef = useRef(autoStart);

	const loop = (now: number) => {
		if (!runningRef.current) return;

		if (startTimeRef.current === null) {
			startTimeRef.current = now - elapsedMs;
		}

		setElapsedMs(now - startTimeRef.current);
		rafRef.current = requestAnimationFrame(loop);
	};

	useEffect(() => {
		if (!autoStart) return;

		rafRef.current = requestAnimationFrame(loop);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [autoStart, loop]);

	const start = () => {
		if (runningRef.current) return;
		runningRef.current = true;
		rafRef.current = requestAnimationFrame(loop);
	};

	const pause = () => {
		runningRef.current = false;
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
		rafRef.current = null;
	};

	const reset = () => {
		startTimeRef.current = null;
		setElapsedMs(0);
	};

	return {
		elapsedMs,
		seconds: elapsedMs / 1000,
		start,
		pause,
		reset,
		running: runningRef.current,
	};
}
