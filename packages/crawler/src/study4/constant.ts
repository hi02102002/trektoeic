export const BASE_URL = "https://study4.com";

export const FLASHCARDS_DISCOVER_URL = `${BASE_URL}/flashcards/discover/`;

export const getFlashcardsListUrl = (topicId: number) =>
	`${BASE_URL}/flashcards/lists/${topicId}/`;
