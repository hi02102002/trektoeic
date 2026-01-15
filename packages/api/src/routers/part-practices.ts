import { partPracticesQueries } from "@trektoeic/db/queries";
import { InputPartPracticeHistorySchema } from "@trektoeic/schemas/part-practice-schema";
import { QuestionWithSubsSchema } from "@trektoeic/schemas/question-schema";
import { createId } from "@trektoeic/utils/create-id";
import z from "zod";
import { requiredAuthProcedure } from "../procedures";

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

		const key = `part-practice:part:${part}:limit:${limit || "all"}:unique:${unique ?? createId()}-user:${context.session.user.id}`;

		if (await context.kv.has(key).catch(() => false)) {
			return z.array(QuestionWithSubsSchema).parse(await context.kv.get(key));
		}

		const records = await partPracticesQueries.getPartPractices(context.db)({
			part,
			limit,
			userId: context.session.user.id,
		});

		await context.kv.set(key, records, {
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
			context.db,
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
			context.db,
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

export const getRedoPartPractices = requiredAuthProcedure
	.route({
		method: "GET",
		tags,
	})
	.input(
		z.object({
			historyId: z.string(),
		}),
	)
	.output(z.array(QuestionWithSubsSchema))
	.handler(async ({ input, context }) => {
		const { historyId } = input;

		const records = await partPracticesQueries.getRedoPartPractices(
			context.session.user.id,
			context.kysely,
		)(historyId);

		return records;
	});

export const partPractices = {
	getPartPractice,
	createPartPracticeHistory,
	getPartPracticeHistoryById,
	getCurrentProgressOfPartPractice,
	getRedoPartPractices,
};
