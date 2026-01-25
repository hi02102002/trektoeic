const MAX_RETRY = 5;

import axios from "axios";
import axiosRetry from "axios-retry";
import { BASE_URL } from "./constant";
import { loadCookies } from "./load-cookies";

export const api = axios.create({
	baseURL: BASE_URL,
	timeout: 15000,
	headers: {
		Cookie: loadCookies(),
	},
	withCredentials: true,
});

axiosRetry(api, {
	retries: MAX_RETRY,
	retryDelay: (retryCount, err) => {
		return axiosRetry.exponentialDelay(retryCount, err, 500);
	},
	retryCondition: (err) => {
		return (
			axiosRetry.isNetworkOrIdempotentRequestError(err) ||
			err.response?.status === 429 ||
			(err.response?.data as { message?: string })?.message ===
				"Too Many Attempts."
		);
	},
	onRetry: (retryCount, err, requestConfig) => {
		console.log(
			`Retrying [${retryCount}] - ${requestConfig.method?.toUpperCase()} ${
				requestConfig.url
			} due to ${err.message}`,
		);
	},
});
