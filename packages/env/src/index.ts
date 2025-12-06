import { config } from "dotenv";
import { z } from "zod";

config();

const EnvSchema = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]),
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
});

const _env = EnvSchema.safeParse(process.env);

if (!_env.success) {
	console.error("❌ Invalid environment variables:");
	console.error(_env.error.format());
	throw new Error("Invalid environment variables");
}

export const env = _env.data;
