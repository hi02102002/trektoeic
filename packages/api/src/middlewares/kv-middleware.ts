import { os } from "@orpc/server";
import { storage } from "../libs/storage";

export const kvProviderMiddleware = os
	.$context<{
		kv?: typeof storage;
	}>()
	.middleware(async ({ context, next }) => {
		const kv = context?.kv ?? storage;

		return next({
			context: {
				kv,
			},
		});
	});
