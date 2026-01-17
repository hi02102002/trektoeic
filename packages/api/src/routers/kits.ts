import { kitsQueries } from "@trektoeic/db/queries";
import { KitSchema } from "@trektoeic/schemas/kit-schema";
import { createOrderByInputSchema } from "@trektoeic/schemas/share-schema";
import z from "zod";
import { publicProcedure } from "../procedures";

const TAGS = ["Kits"] as const;

const getAllKits = publicProcedure
	.route({
		method: "GET",
		tags: TAGS,
		description: "Get all kits, optionally filtered by year",
	})
	.input(
		z.object({
			year: z.union([z.literal("all"), z.number()]).optional(),
			orderBy: createOrderByInputSchema(["year"] as const).optional(),
		}),
	)
	.output(z.array(KitSchema))
	.handler(async ({ input, context }) => {
		const { year = "all", orderBy } = input;

		const records = await kitsQueries.getAllKits(context.kysely)({
			year,
			orderBy,
		});

		return records;
	});

const getAvailableKitYears = publicProcedure
	.route({
		method: "GET",
		tags: TAGS,
		description: "Get all available kit years",
	})
	.output(
		z.array(
			z.object({
				label: z.string(),
				value: z.preprocess((val) => {
					return String(val);
				}, z.string()),
			}),
		),
	)
	.handler(async ({ context }) => {
		const years = await kitsQueries.getAvailableKitYears(context.db)();
		return [
			{ label: "Tất cả", value: "all" },
			...years.map((year) => ({
				label: year.toString(),
				value: year.toString(),
			})),
		];
	});

const getKitBySlug = publicProcedure
	.route({
		method: "GET",
		tags: TAGS,
		description: "Get a kit by its slug",
	})
	.input(
		z.object({
			slug: z.string(),
		}),
	)
	.output(z.any().nullable())
	.handler(async ({ input, context }) => {
		const { slug } = input;

		const kit = await kitsQueries.getKitBySlug(context.db)(slug);

		return kit;
	});

export const kitsRouter = {
	getAllKits,
	getAvailableKitYears,
	getKitBySlug,
};
