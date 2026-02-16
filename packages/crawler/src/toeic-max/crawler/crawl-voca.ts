import { kysely } from "@trektoeic/db";
import { getToken } from "@trektoeic/db/queries/toiec-max-tokens/get-token";
import { callApi } from "../api";
import { runBatchesWithCount, writeToFile } from "../utils";

export async function getGroupDetail(groupId: string, token?: string) {
	const _token = token || (await getToken(kysely)());
	const res = await callApi({
		url: `https://dictionary.scandict.com/api/voca/section/${groupId}`,
		method: "GET",
		direction: true,
		headers: {
			token: _token || "",
		},
		withAgent: false,
	});

	return res.data;
}

export async function getGroups(token?: string) {
	const _token = token || (await getToken(kysely)());
	const res = await callApi({
		url: "https://dictionary.scandict.com/api/voca/group",
		method: "GET",
		direction: true,
		headers: {
			token: _token || "",
		},
		withAgent: false,
	});

	const groups = res.data.map(async (group: any) => {
		const groupDetail = await getGroupDetail(group.id, token);
		return {
			...group,
			childs: groupDetail,
		};
	});

	return Promise.all(groups);
}

export async function getVocabsById(id: string, token?: string) {
	const _token = token || (await getToken(kysely)());
	const res = await callApi({
		url: `https://dictionary.scandict.com/api/voca/word/${id}`,
		method: "GET",
		direction: true,
		headers: {
			token: _token || "",
		},
		withAgent: false,
	});

	return res.data;
}

export async function getAllVocabs() {
	const token = await getToken(kysely)();

	if (!token) {
		return;
	}

	const groups = await getGroups(token || "");
	const mapGroups = new Map<string, any>(); // groupId -> group
	const mapVocabs = new Map<string, any>(); // sectionId -> vocab

	const sectionIds = groups.flatMap((group: any) => {
		mapGroups.set(group.id, group);
		return group.childs.map((section: any) => {
			mapVocabs.set(section.id, section);
			return section.id;
		});
	});

	await runBatchesWithCount(
		sectionIds,
		async (sectionId: string) => {
			const vocabs = await getVocabsById(sectionId, token);
			const section = mapVocabs.get(sectionId);

			mapVocabs.set(sectionId, {
				...section,
				vocabs,
			});

			return vocabs;
		},
		10,
		(idx) => {
			console.log(
				`Fetched vocabs for section ${idx} / ${Math.ceil(sectionIds.length / 10)}`,
			);
		},
	);

	const result = groups.map((group: any) => {
		return {
			...group,
			childs: group.childs.map((section: any) => {
				const sectionData = mapVocabs.get(section.id);
				return {
					...section,
					vocabs: sectionData?.vocabs || [],
				};
			}),
		};
	});

	writeToFile("data/toeicmax-vocabs.json", result);
	return result;
}
