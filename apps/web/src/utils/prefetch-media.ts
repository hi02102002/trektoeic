import type { QuestionWithSubs } from "@trektoeic/schemas/question-schema";
import { getProxiedAudioUrl, getProxiedImageUrl } from "./proxy-image";

/**
 * Prefetch a single media file (image or audio)
 */
const prefetchMedia = (url: string, type: "image" | "audio"): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (type === "image") {
			const img = new Image();
			img.onload = () => resolve();
			img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
			img.src = url;
		} else {
			const audio = new Audio();
			audio.oncanplaythrough = () => resolve();
			audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`));
			audio.preload = "auto";
			audio.src = url;
		}
	});
};

/**
 * Extract all media URLs from questions
 */
const extractMediaUrls = (
	questions: QuestionWithSubs[],
): { images: string[]; audios: string[] } => {
	const images = new Set<string>();
	const audios = new Set<string>();

	for (const question of questions) {
		if (question.audioUrl) {
			audios.add(getProxiedAudioUrl(question.audioUrl));
		}
		if (question.imageUrl) {
			images.add(getProxiedImageUrl(question.imageUrl));
		}
	}

	return {
		images: Array.from(images),
		audios: Array.from(audios),
	};
};

/**
 * Prefetch all media files from questions
 * @param questions - Array of questions with subs
 * @param onProgress - Optional callback to track progress
 * @returns Promise that resolves when all media is prefetched
 */
export const prefetchQuestionMedia = async (
	questions: QuestionWithSubs[],
	onProgress?: (loaded: number, total: number) => void,
): Promise<{ success: number; failed: number; errors: Error[] }> => {
	const { images, audios } = extractMediaUrls(questions);
	const total = images.length + audios.length;

	if (total === 0) {
		return { success: 0, failed: 0, errors: [] };
	}

	let loaded = 0;
	const errors: Error[] = [];

	const prefetchPromises = [
		...images.map((url) =>
			prefetchMedia(url, "image")
				.then(() => {
					loaded++;
					onProgress?.(loaded, total);
				})
				.catch((error) => {
					loaded++;
					errors.push(error);
					onProgress?.(loaded, total);
				}),
		),
		...audios.map((url) =>
			prefetchMedia(url, "audio")
				.then(() => {
					loaded++;
					onProgress?.(loaded, total);
				})
				.catch((error) => {
					loaded++;
					errors.push(error);
					onProgress?.(loaded, total);
				}),
		),
	];

	await Promise.allSettled(prefetchPromises);

	return {
		success: total - errors.length,
		failed: errors.length,
		errors,
	};
};

/**
 * Hook to prefetch media in the background
 */
export const usePrefetchMedia = () => {
	return { prefetchQuestionMedia };
};
