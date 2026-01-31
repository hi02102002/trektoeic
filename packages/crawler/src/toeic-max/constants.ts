import { env } from "@trektoeic/env";

export const BASE_URL = env.TOIECMAX_API_URL;
export const APP_MIX = env.TOIECMAX_APP_MIX;

const isDev = env.NODE_ENV !== "production";

export const RECORD_TO_REGISTER = {
	email: isDev ? "hoanghuyvodev@gmail.com" : "hoanghuyvoprod@gmail.com",
	password: "0394604830Hoanghuy",
	name: "Hoang Huy Vo",
	phone: isDev ? "0344804832" : "0344804831",
};
