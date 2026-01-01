import { createMetadataGenerator } from "tanstack-meta";

export const generateMetadata = createMetadataGenerator({
	titleTemplate: {
		default: "TrekToeic - Chinh phục TOEIC hiệu quả",
		template: "%s | TrekToeic",
	},
	baseUrl: "https://trektoeic.io.vn",
});

export const createOpenGraphData = (
	title: string,
	description: string,
	url: string,
) => {
	return {
		openGraph: {
			type: "website" as const,
			url,
			title,
			description,
			images: "/og.png",
		},
		twitter: {
			card: "summary_large_image" as const,
			title,
			description,
		},
	};
};
