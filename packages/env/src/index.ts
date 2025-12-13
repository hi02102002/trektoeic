import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import { z } from "zod";

const getEnvPath = () => {
	if (process.env.NODE_ENV === "production") {
		return "../../apps/web/.env";
	}
	return "../../apps/web/.env.local";
};

config({
	path: getEnvPath(),
});

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		PORT: z
			.string()
			.default("3000")
			.transform((v) => Number(v))
			.pipe(z.number().int().positive()),

		/**
		 * CLOUDFLARE
		 */
		CLOUDFLARE_BUCKET_NAME: z.string().min(1),
		CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
		CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1),
		CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1),

		/**
		 * BACKBLAZE
		 */
		BACKBLAZE_BUCKET_NAME: z.string().min(1),
		BACKBLAZE_APPLICATION_KEY_ID: z.string().min(1),
		BACKBLAZE_APPLICATION_KEY: z.string().min(1),
		BACKBLAZE_REGION: z.string().min(1),
		/**
		 * AUTH
		 */
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.url().min(1),
		CORS_ORIGIN: z.string().min(1),

		/**
		 * DATABASE
		 */
		DATABASE_URL: z.string().min(1),

		/**
		 * GOOGLE
		 */
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),

		/**
		 * UNOSEND
		 */
		UNOSEND_API_KEY: z.string().min(1),

		/**
		 * TOIECMAX
		 */
		TOIECMAX_APP_MIX: z.string().min(1),
		TOIECMAX_API_URL: z.string().min(1),

		/**
		 * REDIS
		 */
		REDIS_URL: z.string().min(1),
	},
	clientPrefix: "VITE_",
	client: {},
	runtimeEnv: process.env,
});
