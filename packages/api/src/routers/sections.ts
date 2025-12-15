import { partSectionsQueries } from "@trektoeic/db/queries";
import { PartSectionSchema } from "@trektoeic/schemas/part-section-schema";
import z from "zod";
import { requiredAuthProcedure } from "../procedures";

const tags = ["Questions"] as const;

const getPartSection = requiredAuthProcedure
	.route({
		method: "GET",
		tags,
	})
	.input(
		z.object({
			part: z.number().min(1).max(7),
		}),
	)
	.output(PartSectionSchema)
	.handler(async ({ input }) => {
		const { part } = input;

		const section = await partSectionsQueries.getPartSectionByPart()(part);

		return PartSectionSchema.parse(section);
	});

export const partSections = {
	getPartSection,
};
