import { RequestHeadersPlugin } from "@orpc/server/plugins";

export const requestHeader = () => {
	return new RequestHeadersPlugin();
};
