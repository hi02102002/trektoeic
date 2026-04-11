import type { GrammarTopicSummary } from "@trektoeic/schemas/grammar-course-file-schema";
import { withKysely } from "../../utils";

export const listGrammarTopicSummaries = withKysely(
	(db) =>
		async (opts?: {
			userId?: string | null;
		}): Promise<GrammarTopicSummary[]> => {
			const topics = await db
				.selectFrom("grammarTopics as gt")
				.innerJoin("grammarCourses as gc", "gc.id", "gt.courseId")
				.select([
					"gt.id",
					"gt.slug",
					"gt.title",
					"gt.description",
					"gt.relatedParts",
					"gc.slug as courseSlug",
					"gc.title as courseTitle",
				])
				.orderBy("gc.sortOrder", "asc")
				.orderBy("gt.sortOrder", "asc")
				.execute();

			if (topics.length === 0) return [];

			const topicIds = topics.map((t) => t.id);

			const counts = await db
				.selectFrom("grammarExercises")
				.select(["topicId", (eb) => eb.fn.count<number>("id").as("c")])
				.where("topicId", "in", topicIds)
				.groupBy("topicId")
				.execute();

			const countMap = new Map(
				counts.map((r) => [r.topicId, Number(r.c)] as const),
			);

			let studiedIds = new Set<string>();
			if (opts?.userId) {
				const rows = await db
					.selectFrom("grammarTopicStudied")
					.select("topicId")
					.where("userId", "=", opts.userId)
					.where("topicId", "in", topicIds)
					.execute();
				studiedIds = new Set(rows.map((r) => r.topicId));
			}

			return topics.map((t) => ({
				slug: t.slug,
				title: t.title,
				description: t.description,
				relatedParts: t.relatedParts,
				exerciseCount: countMap.get(t.id) ?? 0,
				courseSlug: t.courseSlug,
				courseTitle: t.courseTitle,
				studied: studiedIds.has(t.id),
			}));
		},
);
