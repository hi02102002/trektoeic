import { os } from "@orpc/server";
import z from "zod";
import type { Context } from "../context";

export const o = os.$context<Context>().errors({
	VALIDATION_ERROR: {
		status: 400,
		data: z.object({
			formErrors: z.array(z.string()),
			fieldErrors: z.record(z.string(), z.array(z.string()).optional()),
		}),
	},
});
