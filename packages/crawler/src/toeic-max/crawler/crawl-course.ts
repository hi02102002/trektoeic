import { kysely } from "@trektoeic/db";
import { getToken } from "@trektoeic/db/queries/toiec-max-tokens/get-token";
import { apiWithDecrypt, callApi } from "../api";
import { runBatchesWithCount, writeToFile } from "../utils";

const COURSE_IDS = [1, 2];

export async function getCourseById(id: number, token?: string) {
	const _token = token || (await getToken(kysely)());

	const res = await callApi({
		method: "GET",
		url: `/app/course/${id}`,
		headers: {
			token: _token || "",
			"Content-Type": "application/json",
		},
		withAgent: false,
	});

	return res?.data || null;
}

export async function getLessonByTopicById(id: number, token?: string) {
	const _token = token || (await getToken(kysely)());

	const res = await callApi({
		method: "GET",
		url: `/app/topic/${id}`,
		headers: {
			token: _token || "",
			"Content-Type": "application/json",
		},
		withAgent: false,
	});

	return res?.data || null;
}

export async function getExerciseByTopicId(topicId: number, token?: string) {
	const _token = token || (await getToken(kysely)());

	const res = await apiWithDecrypt({
		method: "GET",
		url: `/app/exercise/${topicId}`,
		headers: {
			token: _token || "",
			"Content-Type": "application/json",
		},
		withAgent: false,
	});

	return res?.data || null;
}

export async function getTopicById(id: number, token?: string) {
	const [lesson, exercise] = await Promise.all([
		getLessonByTopicById(id, token),
		getExerciseByTopicId(id, token),
	]);

	return {
		lesson,
		exercise,
		id,
	};
}

export async function getAllCourses() {
	const token = await getToken(kysely)();

	if (!token) {
		return;
	}

	const mapTopic = new Map<number, any>();
	const courses = await Promise.all(
		COURSE_IDS.map((id) => getCourseById(id, token)),
	);

	courses
		.flatMap((course) => course.list_topic || [])
		.flatMap((topic) => {
			if (!mapTopic.has(topic.id)) {
				mapTopic.set(topic.id, topic);
			}
			return topic.subs;
		})
		.map((topic) => {
			const topicId = topic.id;
			if (!mapTopic.has(topicId)) {
				mapTopic.set(topicId, topic);
			}
			return topicId;
		});

	const topicIds = Array.from(mapTopic.keys());

	const topicDetails = await runBatchesWithCount<number, any>(
		topicIds,
		async (id) => getTopicById(id, token),
		5,
		() => {},
	);

	topicDetails.map((detail) => {
		const topic = mapTopic.get(detail.id);

		mapTopic.set(topic.id, {
			...topic,
			...detail,
		});

		return {
			...topic,
			lesson: detail.lesson,
			exercise: detail.exercise,
		};
	});

	const result = courses.map((course) => ({
		...course,
		list_topic: course.list_topic?.map((topic: any) => {
			const detail = mapTopic.get(topic.id);

			return {
				...topic,
				...detail,
				subs: detail?.subs?.map((sub: any) => {
					const subDetail = mapTopic.get(sub.id);
					return {
						...sub,
						...subDetail,
					};
				}),
			};
		}),
	}));

	writeToFile("data/toeicmax-courses.json", result);

	return result;
}
