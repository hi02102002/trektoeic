import * as betterUploadClient from "@better-upload/client";
import * as betterUploadServer from "@better-upload/server";
import { backblaze, cloudflare } from "@better-upload/server/clients";
import { env } from "@trektoiec/env";

const cloudflareRouter: betterUploadServer.Router = {
	client: cloudflare({
		accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
		secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
		accountId: env.CLOUDFLARE_ACCOUNT_ID,
	}),
	bucketName: env.CLOUDFLARE_BUCKET_NAME,
	routes: {
		images: betterUploadServer.route({
			fileTypes: ["image/*"],
			multipleFiles: true,
			maxFiles: 4,
		}),
	},
};

const backblazeRouter: betterUploadServer.Router = {
	client: backblaze({
		applicationKeyId: env.BACKBLAZE_APPLICATION_KEY_ID,
		applicationKey: env.BACKBLAZE_APPLICATION_KEY,
		region: env.BACKBLAZE_REGION,
	}),
	bucketName: env.BACKBLAZE_BUCKET_NAME,
	routes: {
		images: betterUploadServer.route({
			fileTypes: ["image/*"],
			multipleFiles: true,
			maxFiles: 4,
		}),
	},
};

export {
	betterUploadServer,
	cloudflareRouter,
	backblazeRouter,
	betterUploadClient,
};
