import { kysely } from "@trektoeic/db";
import { getToken } from "@trektoeic/db/queries/toiec-max-tokens/get-token";
import { apiWithDecrypt, callApi } from "../api";
import { runBatchesWithCount, writeToFile } from "../utils";

export const getAllKits = async (token: string) => {
	const _token = token ?? (await getToken(kysely)());
	const res = await callApi({
		method: "GET",
		headers: {
			token: _token,
		},
		url: "/app/kits",
		withAgent: false,
	});

	return res.data;
};

export const getMockTestById = async (token: string, id: number) => {
	const _token = token ?? (await getToken(kysely)());

	const res = await apiWithDecrypt({
		method: "GET",
		headers: {
			token: _token,
		},
		url: `/app/kits/${id}`,
		withAgent: false,
	});

	return res.data;
};

export const getAllMockTests = async () => {
	const token = await getToken(kysely)();

	if (!token) {
		return;
	}

	const res = await getAllKits(token);

	const hashedKits = new Map<number, any>(res.map((kit: any) => [kit.id, kit]));
	const sections: any[] = [];

	const questions = await runBatchesWithCount(
		Array.from(hashedKits.keys()),
		(kitId) => {
			hashedKits.set(kitId, {
				...(hashedKits.get(kitId) || {}),
				questions: [],
			});

			return getMockTestById(token, kitId);
		},
		5,
		(idx) => {
			console.log(`Crawled batch ${idx} / ${Math.ceil(hashedKits.size / 5)}`);
		},
	).then((questions) => {
		return questions.flat();
	});

	questions.forEach((question) => {
		const kit = hashedKits.get(question.test_kit_id);

		if (kit) {
			kit.questions.push(question);
		} else {
			sections.push(question);
		}
	});

	writeToFile(
		"data/toeic-max-mock-tests.json",
		Array.from(hashedKits.values()),
	);

	writeToFile("data/toeic-max-mock-test-sections.json", sections);

	return Array.from(hashedKits.values());
};
