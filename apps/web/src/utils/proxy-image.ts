export const getProxiedImageUrl = (url: string | null | undefined): string => {
	if (!url) return "";

	if (url.startsWith("/")) {
		return url;
	}

	if (url.includes("scandict.com")) {
		const urlObj = new URL(url);
		const path = urlObj.pathname;
		return `/proxy${path}`;
	}

	return url;
};

export const getProxiedAudioUrl = (url: string | null | undefined): string => {
	if (!url) return "";

	if (url.startsWith("/")) {
		return url;
	}

	if (url.includes("scandict.com")) {
		const urlObj = new URL(url);
		const path = urlObj.pathname;
		return `/proxy${path}`;
	}

	return url;
};

export const getProxiedImageUrls = (
	urls: (string | null | undefined)[],
): string[] => {
	return urls.map((url) => getProxiedImageUrl(url));
};

export const getProxiedAudioUrls = (
	urls: (string | null | undefined)[],
): string[] => {
	return urls.map((url) => getProxiedAudioUrl(url));
};
