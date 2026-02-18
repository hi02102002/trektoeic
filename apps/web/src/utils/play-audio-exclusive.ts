let activeAudio: HTMLAudioElement | null = null;

const resetAudio = (audio: HTMLAudioElement) => {
	audio.pause();
	audio.currentTime = 0;
};

export const playAudioExclusive = async (src: string) => {
	if (!src) return;
	if (typeof Audio === "undefined") return;

	if (activeAudio) {
		resetAudio(activeAudio);
	}

	const audio = new Audio(src);
	activeAudio = audio;

	audio.onended = () => {
		if (activeAudio === audio) {
			activeAudio = null;
		}
	};

	audio.onerror = () => {
		if (activeAudio === audio) {
			activeAudio = null;
		}
	};

	try {
		await audio.play();
	} catch {
		if (activeAudio === audio) {
			activeAudio = null;
		}
	}
};
