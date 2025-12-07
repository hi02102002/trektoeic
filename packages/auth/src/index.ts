import { db } from "@trektoiec/db";
import * as schema from "@trektoiec/db/schema/auth";
import { env } from "@trektoiec/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	trustedOrigins: [env.CORS_ORIGIN],
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		tanstackStartCookies(),
		magicLink({
			sendMagicLink(data) {
				console.log("Magic link requested: hoho", data);
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
