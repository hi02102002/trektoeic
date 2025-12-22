import { partPracticesQueries } from "@trektoeic/db/queries/index";
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

		const records = await partPracticesQueries.getPartPractices()({
			part,
			limit,
			userId: context.session.user.id,
		});

		await context.kv.set(key, records, {
			ttl: 60 * 60,
		});

		return z.array(QuestionWithSubsSchema).parse(records);
	});

export const partPractices = {
	getPartPractice,
};
