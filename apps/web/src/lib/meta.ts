import { createMetadataGenerator } from "tanstack-meta";

export const generateMetadata = createMetadataGenerator({
	titleTemplate: {
		default: "TrekToeic - Chinh phục TOEIC hiệu quả",
		template: "%s | TrekToeic",
	},
	baseUrl: "https://trektoeic.io.vn",
});
