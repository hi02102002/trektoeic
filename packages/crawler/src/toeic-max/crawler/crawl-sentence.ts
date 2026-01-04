import { db } from "@trektoeic/db";
import { getToken } from "@trektoeic/db/queries/toiec-max-tokens/get-token";
import { callApi } from "../api";
import { writeToFile } from "../utils";

export async function getListIdsOfSentences(token?: string) {
	const _token = token || (await getToken(db)());
	let page = 1;
	let total_pages = 1;

	const sentences: any[] = [];

	while (page <= total_pages) {
		const res = await callApi({
			method: "GET",
			url: "/app/sentence",
			params: {
				page,
				limit: 20,
			},
			headers: {
				token: _token || "",
				"Content-Type": "application/json",
			},
			withAgent: false,
		});

		if (!res || !res.data) {
			break;
		}

		page += 1;
		total_pages = res.data.meta.pagination.total_pages;
		sentences.push(...res.data.data);
	}

	return sentences.map((it) => it.id);
}

export async function getSentenceDetail(id: number, token?: string) {
	const _token = token || (await getToken(db)());

	const res = await callApi({
		method: "GET",
		url: `/app/roadmap-detail/${id}`,
		headers: {
			token: _token || "",
			"Content-Type": "application/json",
		},
		withAgent: false,
	});

	return res?.data || null;
}

export async function getAllSentences() {
	const token = await getToken(db)();

	if (!token) {
		return;
	}
	const sentenceIds = await getListIdsOfSentences(token);

	const sentences = await Promise.all(
		sentenceIds.map((id) => getSentenceDetail(id, token)),
	).then((results) => {
		return results.filter((it) => it !== null);
	});

	sentences.sort((a, b) => a.id - b.id);

	writeToFile("data/toeic-max-sentences.json", sentences);

	return sentences;
}
