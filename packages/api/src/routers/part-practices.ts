import { partPracticesQueries } from "@trektoeic/db/queries";
import {
	InputPartPracticeHistorySchema,
	PartPracticeMetadataSchema,
} from "@trektoeic/schemas/part-practice-schema";
import { QuestionWithSubsSchema } from "@trektoeic/schemas/question-schema";
import { createId } from "@trektoeic/utils/create-id";
import z from "zod";
import { requiredAuthProcedure } from "../procedures";
import { CACHED_KEYS } from "../utils/cached-keys";

const tags = ["Part Practice"] as const;

const getPartPractice = requiredAuthProcedure
	.route({
		method: "GET",
		tags,
	})
	.input(
		z.object({
			part: z.number().min(1).max(7),
			limit: z.number().optional(),
			unique: z.string().optional(),
		}),
	)
	.output(z.array(QuestionWithSubsSchema))
	.handler(async ({ input, context }) => {
		const { part, limit = 10, unique } = input;

		const key = CACHED_KEYS.partPracticeQuestions(
			part,
			limit,
			unique ?? createId(),
		);

		if (await context.kv.has(key).catch(() => false)) {
			const cached = await context.kv.getItem(key);

			return z.array(QuestionWithSubsSchema).parse(cached);
		}

		const records = await partPracticesQueries.getPartPractices(context.kysely)(
			{
				part,
				limit,
				userId: context.session.user.id,
			},
		);

		await context.kv.setItem(key, records, {
			ttl: 60 * 60,
		});

		return z.array(QuestionWithSubsSchema).parse(records);
	});

const createPartPracticeHistory = requiredAuthProcedure
	.route({
		method: "POST",
		tags,
	})
	.input(InputPartPracticeHistorySchema)
	.handler(async ({ input, context }) => {
		const record = await partPracticesQueries.createPartPracticeHistory(
			context.session.user.id,
			context.kysely,
		)(input);

		return record;
	});

const getPartPracticeHistoryById = requiredAuthProcedure
	.route({
		method: "GET",
		tags,
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.output(
		z
			.object({
				history: InputPartPracticeHistorySchema,
				questions: z.array(QuestionWithSubsSchema),
			})
			.nullable(),
	)
	.handler(async ({ input, context }) => {
		const { id } = input;

		const result = await partPracticesQueries.getPartPracticeHistoryById(
			context.session.user.id,
			context.kysely,
		)(id);

		return result;
	});

export const getCurrentProgressOfPartPractice = requiredAuthProcedure
	.route({
		method: "GET",
		tags,
	})
	.input(
		z.object({
			part: z.union([z.string(), z.number()]),
		}),
	)
	.output(
		z.object({
			attempt: z.number(),
			correct: z.number(),
			completed: z.number(),
		}),
	)
	.handler(async ({ context, input }) => {
		const result = await partPracticesQueries.getCurrentProgressOfPartPractice(
			context.session.user.id,
			context.kysely,
		)(input.part);

		return result;
	});

export const redoPartPractices = requiredAuthProcedure
	.route({
		method: "POST",
		tags,
	})
	.input(
		z.object({
			historyId: z.string(),
		}),
	)
	.output(
		z
			.object({
				questions: z.array(QuestionWithSubsSchema),
				metadata: PartPracticeMetadataSchema,
				originalHistoryId: z.string(),
				cacheKey: z.string(),
			})
			.nullable(),
	)
	.handler(async ({ context, input }) => {
		const { historyId } = input;

		const result = await partPracticesQueries.redoPartPractices(
			context.session.user.id,
			context.kysely,
		)(historyId);

		if (!result) {
			return null;
		}

		const cacheKey = createId();
		const key = CACHED_KEYS.partPracticeQuestions(
			result.metadata.part,
			result.questions.length,
			cacheKey,
		);

		await context.kv.set(key, result.questions, {
			ttl: 60 * 60,
		});

		return {
			...result,
			cacheKey,
		};
	});

export const partPractices = {
	getPartPractice,
	createPartPracticeHistory,
	getPartPracticeHistoryById,
	getCurrentProgressOfPartPractice,
	redoPartPractices,
};
