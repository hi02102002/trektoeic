import { getToken } from "@trektoeic/db/queries/toiec-max-tokens/get-token";

import { apiWithDecrypt, callApi } from "../api";
import { writeToFile } from "../utils";

export async function getListListenings(token?: string) {
	const _token = token || (await getToken()());
	let page = 1;
	let total_pages = 1;

	const listenings: any[] = [];

	while (page <= total_pages) {
		const res = await callApi({
			method: "GET",
			url: "/app/spell",
			params: {
				page,
				p: 0,
			},
			headers: {
				token: _token || "",
				"Content-Type": "application/json",
			},
		});

		if (!res || !res.data) {
			break;
		}

		page += 1;
		total_pages = res.data.meta.pagination.total_pages;
		listenings.push(...res.data.data);
	}

	return listenings;
}

export async function getListeningDetail(id: number, token?: string) {
	const _token = token || (await getToken()());
	const res = await apiWithDecrypt({
		method: "GET",
		url: `/app/spell/${id}`,
		headers: {
			token: _token || "",
			"Content-Type": "application/json",
		},
	});

	return res?.data || null;
}

export async function getAllListeningsWithDetail() {
	const map = new Map<number, any>();
	const token = await getToken()();

	if (!token) {
		return;
	}

	const ids = await getListListenings(token).then((res) =>
		res.map((it) => {
			map.set(it.id, it);
			return it.id;
		}),
	);

	const details = await Promise.all(
		ids.map((id) => getListeningDetail(id, token)),
	);

	details.sort((a, b) => a.id - b.id);

	writeToFile("data/toeicmax-listenings-1.json", details);

	return details;
}
