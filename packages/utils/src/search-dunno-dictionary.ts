export const searchDunnoDictionary = async (keyword: string) => {
	const query = keyword.trim();
	if (!query) return null;

	try {
		const response = await fetch(
			`https://api.dunno.ai/api/search/vi/envi/${encodeURIComponent(query)}?limit=1&page=1`,
		);

		if (!response.ok) {
			console.warn("Dunno API non-OK response", {
				status: response.status,
				statusText: response.statusText,
				keyword: query,
			});
			return null;
		}

		return (await response.json()) as unknown;
	} catch (error) {
		console.warn("Dunno API request failed", {
			keyword: query,
			error,
		});
		return null;
	}
};
