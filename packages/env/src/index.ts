import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import { z } from "zod";

if (
	typeof process !== "undefined" &&
	process.versions != null &&
	process.versions.node != null
) {
	const getEnvPath = () => {
		if (process.env.NODE_ENV === "production") {
			return "../../apps/web/.env";
		}
		return "../../apps/web/.env.local";
	};

	config({
		path: getEnvPath(),
	});
}

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
		CLOUDFLARE_API_TOKEN_KV: z.string().min(1),
		CLOUDFLARE_KV_NAMESPACE_ID: z.string().min(1),

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
		BETTER_AUTH_URL: z.string().min(1),
		CORS_ORIGIN: z
			.string()
			.min(1)
			.transform((val) => val.split(",").map((url) => url.trim())),

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
		UPSTASH_REDIS_REST_URL: z.string().min(1),
		UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
	},
	clientPrefix: "VITE_",
	client: {
		VITE_BASE_URL: z.string().optional().default("http://localhost:3000"),
	},
	runtimeEnv:
		typeof process !== "undefined" ? process.env : (import.meta as any).env,
});
