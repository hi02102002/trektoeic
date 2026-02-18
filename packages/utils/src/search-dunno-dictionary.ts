export const searchDunnoDictionary = async (keyword: string) => {
	const query = keyword.trim();
	if (!query) return null;

	const response = await fetch(
		`https://api.dunno.ai/api/search/vi/envi/${encodeURIComponent(query)}?limit=1&page=1`,
	);

	if (!response.ok) {
		throw new Error("Failed to fetch dunno detail");
	}

	return (await response.json()) as unknown;
};
