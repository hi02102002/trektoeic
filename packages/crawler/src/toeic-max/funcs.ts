import { getToken } from "@trektoeic/db/queries/toiec-max-tokens/get-token";
import { upsertToken } from "@trektoeic/db/queries/toiec-max-tokens/upsert-token";
import { callApi, publicApi } from "./api";
import { RECORD_TO_REGISTER } from "./constants";

export const deleteAccount = async () => {
	const token = await getToken()();

	if (!token) {
		return;
	}

	await callApi({
		method: "POST",
		url: "/app/del-account",
		headers: {
			token: token,
		},
		withAgent: false,
	});
};

export const registerAccount = async () => {
	const formData = new FormData();

	Object.entries(RECORD_TO_REGISTER).forEach(([key, value]) => {
		formData.append(key, value);
	});

	await publicApi({
		method: "POST",
		url: "app-register",
		data: formData,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

export const loginAccount = async () => {
	const token = await publicApi({
		method: "POST",
		url: "/app-login",
		data: {
			phone: RECORD_TO_REGISTER.phone,
			pass: RECORD_TO_REGISTER.password,
		},
	}).then((res) => res.token);

	if (!token) {
		return;
	}

	await upsertToken()(token);
};

export const registerCourse = async (courseId: number) => {
	const token = await getToken()();

	if (!token) {
		return;
	}

	await callApi({
		method: "POST",
		url: "/app/course/register",
		headers: {
			token: token,
		},
		data: {
			course_id: courseId,
		},
		withAgent: false,
	});
};

export const refreshToken = async () => {
	await deleteAccount();
	await registerAccount();
	await loginAccount();

	await Promise.all([1, 2].map((courseId) => registerCourse(courseId)));
};
