import { db } from "@trektoeic/db";
import * as schema from "@trektoeic/db/schema/auth";
import { env } from "@trektoeic/env";
import { sendMagicLink } from "@trektoeic/mailer";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	trustedOrigins: env.CORS_ORIGIN,
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		tanstackStartCookies(),
		magicLink({
			sendMagicLink(data) {
				sendMagicLink({
					email: data.email,
					url: data.url,
				});
			},
		}),
	],
	rateLimit: {
		enabled: true,
	},
	customRules: {
		"/get-session": false,
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
});
