import { ResponseHeadersPlugin } from "@orpc/server/plugins";

export const responseHeader = () => {
	return new ResponseHeadersPlugin();
};
