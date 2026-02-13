import type { Kysely } from "kysely";
import { kSql } from "../../libs/kysely";
import type { KyselyDatabase } from "../../types";

export const buildCategoriesQuery = (db: Kysely<KyselyDatabase>) => {
	return db
		.with("word_counts", (qb) =>
			qb
				.selectFrom("vocabularyCategories")
				.leftJoin("vocabularies", (join) =>
					join.onRef("vocabularies.categoryId", "=", "vocabularyCategories.id"),
				)
				.select(({ fn }) => [
					"vocabularyCategories.id",
					kSql<number>`CAST(${fn.count("vocabularies.id")} AS INTEGER)`.as(
						"direct_word_count",
					),
				])
				.groupBy("vocabularyCategories.id"),
		)
		.selectFrom("vocabularyCategories")
		.leftJoin("word_counts", (join) =>
			join.onRef("word_counts.id", "=", "vocabularyCategories.id"),
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
		]);
};
