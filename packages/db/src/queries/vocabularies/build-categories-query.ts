import type { Kysely } from "kysely";
import { kSql } from "../../libs/kysely";
import type { KyselyDatabase } from "../../types";

export const buildCategoriesQuery = (
	db: Kysely<KyselyDatabase>,
	userId: string,
) => {
	return db
		.withRecursive("category_tree", (qb) =>
			qb
				.selectFrom("vocabularyCategories as root")
				.select(["root.id as rootId", "root.id as categoryId"])
				.unionAll(
					qb
						.selectFrom("category_tree as ct")
						.innerJoin(
							"vocabularyCategories as child",
							"child.parentId",
							"ct.categoryId",
						)
						.select(["ct.rootId as rootId", "child.id as categoryId"]),
				),
		)
		.with("voc", (qb) =>
			qb
				.selectFrom("category_tree as ct")
				.leftJoin("vocabularies", (join) =>
					join.onRef("vocabularies.categoryId", "=", "ct.categoryId"),
				)
				.select(["ct.rootId as id", "vocabularies.id as vocabularyId"]),
		)
		.with("word_counts", (qb) =>
			qb
				.selectFrom("voc")
				.select(({ fn }) => [
					"voc.id",
					kSql<number>`CAST(${fn.count("voc.vocabularyId")} AS INTEGER)`.as(
						"direct_word_count",
					),
				])
				.groupBy("voc.id"),
		)
		.with("due_counts", (qb) => {
			return qb
				.selectFrom("voc")
				.innerJoin("vocabularyReviewCards as vrc", (join) =>
					join
						.onRef("vrc.vocabularyId", "=", "voc.vocabularyId")
						.on("vrc.userId", "=", userId),
				)
				.select(({ fn }) => [
					"voc.id",
					kSql<number>`CAST(${fn.count("voc.vocabularyId")} AS INTEGER)`.as(
						"due_word_count",
					),
				])
				.where("vrc.nextReviewAt", "<=", new Date())
				.groupBy("voc.id");
		})
		.with("learned_counts", (qb) =>
			qb
				.selectFrom("voc")
				.innerJoin("vocabularyReviewCards as vrc", (join) =>
					join
						.onRef("vrc.vocabularyId", "=", "voc.vocabularyId")
						.on("vrc.userId", "=", userId),
				)
				.select(({ fn }) => [
					"voc.id",
					kSql<number>`CAST(${fn.count("voc.vocabularyId")} AS INTEGER)`.as(
						"learned_word_count",
					),
				])
				.where("vrc.state", "=", "mastered")
				.groupBy("voc.id"),
		)
		.selectFrom("vocabularyCategories")
		.leftJoin("word_counts", (join) =>
			join.onRef("word_counts.id", "=", "vocabularyCategories.id"),
		)
		.leftJoin("due_counts", (join) =>
			join.onRef("due_counts.id", "=", "vocabularyCategories.id"),
		)
		.leftJoin("learned_counts", (join) =>
			join.onRef("learned_counts.id", "=", "vocabularyCategories.id"),
		)
		.select([
			"vocabularyCategories.id",
			"vocabularyCategories.name",
			"vocabularyCategories.slug",
			"vocabularyCategories.alias",
			"vocabularyCategories.level",
			"vocabularyCategories.parentId",
			"vocabularyCategories.hasChild",
			"vocabularyCategories.updatedAt",
			"vocabularyCategories.createdAt",
			kSql<number>`COALESCE(word_counts.direct_word_count, 0)::int`.as(
				"totalWords",
			),
			kSql<number>`COALESCE(due_counts.due_word_count, 0)::int`.as("dueWords"),
			kSql<number>`COALESCE(
				ROUND(
					(COALESCE(learned_counts.learned_word_count, 0)::numeric * 100.0)
					/ NULLIF(COALESCE(word_counts.direct_word_count, 0), 0),
					1
				),
				0
			)::float8`.as("progressPct"),
			kSql<number>`COALESCE(learned_counts.learned_word_count, 0)::int`.as(
				"learnedWords",
			),
		]);
};
