import {
	VocabularyCategorySchema,
	VocabularySchema,
} from "@trektoeic/schemas/vocabularies-schema";
import type { Kysely } from "kysely";
import { kSql } from "../../libs/kysely";
import type { KyselyDatabase } from "../../types";
import { withUserAndKysely } from "../../utils";

class CategoriesQuery {
	private buildCategoriesQuery(db: Kysely<KyselyDatabase>) {
		return db
			.with("child_categories", (qb) =>
				qb
					.selectFrom("vocabularyCategories")
					.select(["id", "parentId", "level"])
					.where("parentId", "is not", null),
			)
			.with("word_counts", (qb) =>
				qb
					.selectFrom("vocabularyCategories")
					.leftJoin("vocabularies", (join) =>
						join.onRef(
							"vocabularies.categoryId",
							"=",
							"vocabularyCategories.id",
						),
					)
					.select(({ fn }) => [
						"vocabularyCategories.id",
						kSql<number>`CAST(${fn.count("vocabularies.id")} AS INTEGER)`.as(
							"direct_word_count",
						),
					])
					.groupBy("vocabularyCategories.id"),
			)
			.with("child_word_counts", (qb) =>
				qb
					.selectFrom("vocabularyCategories")
					.innerJoin("child_categories", (join) =>
						join.onRef(
							"child_categories.parentId",
							"=",
							"vocabularyCategories.id",
						),
					)
					.innerJoin("vocabularies", (join) =>
						join.onRef("vocabularies.categoryId", "=", "child_categories.id"),
					)
					.select(({ fn }) => [
						"vocabularyCategories.id",
						kSql<number>`CAST(${fn.count("vocabularies.id")} AS INTEGER)`.as(
							"child_word_count",
						),
					])
					.where("vocabularyCategories.level", "=", 1)
					.groupBy("vocabularyCategories.id"),
			)
			.selectFrom("vocabularyCategories")
			.leftJoin("word_counts", (join) =>
				join.onRef("word_counts.id", "=", "vocabularyCategories.id"),
			)
			.leftJoin("child_word_counts", (join) =>
				join.onRef("child_word_counts.id", "=", "vocabularyCategories.id"),
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
				kSql<number>`
				COALESCE(
					CASE 
						WHEN vocabulary_categories.level = 1 
						THEN COALESCE(word_counts.direct_word_count, 0) + COALESCE(child_word_counts.child_word_count, 0)
						ELSE COALESCE(word_counts.direct_word_count, 0)
					END,
					0
				)::int
			`.as("totalWords"),
			]);
	}

	getAllCategories = withUserAndKysely((_userId, db) => {
		return async ({
			parentId,
			level = 1,
		}: {
			parentId?: string;
			level?: number;
		}) => {
			const records = await this.buildCategoriesQuery(db)
				.$if(parentId !== undefined, (qb) =>
					qb.where("vocabularyCategories.parentId", "=", parentId as string),
				)
				.$if(level !== undefined, (qb) =>
					qb.where("vocabularyCategories.level", "=", level as number),
				)
				.orderBy("vocabularyCategories.name", "asc")
				.execute();
			return VocabularyCategorySchema.array().parse(records);
		};
	});

	getCategoryById = withUserAndKysely((_userId, db) => {
		return async ({ id }: { id: string }) => {
			const record = await this.buildCategoriesQuery(db)
				.where("vocabularyCategories.id", "=", id)
				.executeTakeFirst();
			return VocabularyCategorySchema.parse(record);
		};
	});

	getCategoryBySlug = withUserAndKysely((_userId, db) => {
		return async ({ slug }: { slug: string }) => {
			const record = await this.buildCategoriesQuery(db)
				.where("vocabularyCategories.slug", "=", slug)
				.executeTakeFirst();
			return VocabularyCategorySchema.parse(record);
		};
	});

	getVocabulariesByCategoryId = withUserAndKysely((_userId, db) => {
		return async ({
			categoryId,
			page = 1,
			limit = 10,
		}: {
			categoryId: string;
			page: number;
			limit: number;
		}) => {
			const records = await db
				.selectFrom("vocabularies")
				.selectAll()
				.where("categoryId", "=", categoryId)
				.orderBy("name", "asc")
				.limit(limit)
				.offset((page - 1) * limit)
				.execute();
			// Normalize collection: DB may have array from old/toeicmax data; schema expects object | null
			const normalized = records.map((r) => ({
				...r,
				collection:
					r.collection != null && !Array.isArray(r.collection)
						? r.collection
						: null,
			}));
			return VocabularySchema.array().parse(normalized);
		};
	});
}

export const vocabulariesQueries = new CategoriesQuery();
