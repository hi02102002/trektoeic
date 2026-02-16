import type { Kysely } from "kysely";
import { kSql } from "../../libs/kysely";
import type { KyselyDatabase } from "../../types";

export const whereCategoryInTree = (
	db: Kysely<KyselyDatabase>,
	categoryColumnRef: string,
	categoryId: string,
) => {
	const categoryTreeQuery = db
		.withRecursive("category_tree", (qb) =>
			qb
				.selectFrom("vocabularyCategories")
				.select("id")
				.where("id", "=", categoryId)
				.unionAll(
					qb
						.selectFrom("vocabularyCategories as vc")
						.innerJoin("category_tree as ct", "vc.parentId", "ct.id")
						.select("vc.id"),
				),
		)
		.selectFrom("category_tree")
		.select("id");

	return kSql<boolean>`
		${kSql.ref(categoryColumnRef)} IN (
			${categoryTreeQuery}
		)
	`;
};
