import type { Context } from "@orpc/server";
import { CompressionPlugin } from "@orpc/server/fetch";

export const compression = <T extends Context>() => {
	return new CompressionPlugin<T>();
};
