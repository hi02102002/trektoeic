import * as betterUploadClient from "@better-upload/client";
import * as betterUploadServer from "@better-upload/server";
import { backblaze, cloudflare } from "@better-upload/server/clients";

const cloudflareRouter: betterUploadServer.Router = {
	client: cloudflare(),
	bucketName: "my-bucket",
	routes: {
		images: betterUploadServer.route({
			fileTypes: ["image/*"],
			multipleFiles: true,
			maxFiles: 4,
		}),
	},
};

const backblazeRouter: betterUploadServer.Router = {
	client: backblaze(),
	bucketName: "my-bucket",
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
