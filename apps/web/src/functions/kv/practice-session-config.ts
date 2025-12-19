import { createClientOnlyFn, createIsomorphicFn } from "@tanstack/react-start";
import z from "zod";
import { storage } from "@/lib/storage";

const PracticeSessionConfigSchema = z.object({
	part: z.number(),
	mode: z.enum(["normal", "timed"]),
	numberOfQuestions: z.number(),
	limitTime: z.number().optional(),
	sessionId: z.string(),
});

export type TPracticeSessionConfig = z.infer<
	typeof PracticeSessionConfigSchema
>;
export const PRACTICE_SESSION_CONFIG_KEYS = {
	PRACTICE_SESSION_CONFIG: "practice-session-config",
};

export const setPracticeSessionConfig = createClientOnlyFn(
	async (config: TPracticeSessionConfig) => {
		await storage.setItem(
			PRACTICE_SESSION_CONFIG_KEYS.PRACTICE_SESSION_CONFIG,
			config,
			{
				ttl: 60 * 60,
			},
		);
	},
);

export const getPracticeSessionConfig = createIsomorphicFn()
	.server(() => {
		return null;
	})
	.client(async () => {
		const config = await storage.getItem(
			PRACTICE_SESSION_CONFIG_KEYS.PRACTICE_SESSION_CONFIG,
		);
		return PracticeSessionConfigSchema.parse(config);
	});
