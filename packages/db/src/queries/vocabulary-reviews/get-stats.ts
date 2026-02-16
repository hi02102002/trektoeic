import { kSql } from "../../libs/kysely";
import { withUserAndKysely } from "../../utils";
import { whereCategoryInTree } from "../shared";

export const getStats = withUserAndKysely((userId, db) => {
	return async ({ categoryId }: { categoryId?: string }) => {
		const result = await db
			.with("total_words", (eb) =>
				eb
					.selectFrom("vocabularies as v")
					.$if(!!categoryId, (eb) =>
						eb.where(
							whereCategoryInTree(db, "v.categoryId", categoryId as string),
						),
					)
					.select((eb) => [
						kSql<number>`CAST(${eb.fn.count("v.id")} AS INTEGER)`.as("count"),
					]),
			)
			.with("v_and_vrc", (eb) =>
				eb
					.selectFrom("vocabularies as v")
					.$if(!!categoryId, (eb) =>
						eb.where(
							whereCategoryInTree(db, "v.categoryId", categoryId as string),
						),
					)
					.leftJoin("vocabularyReviewCards as vrc", (join) =>
						join
							.onRef("v.id", "=", "vrc.vocabularyId")
							.on("vrc.userId", "=", userId),
					)
					.select(["v.categoryId", "vrc.state"]),
			)
			.with("master_stat_count", (eb) =>
				eb
					.selectFrom("v_and_vrc")
					.select((eb) => [
						kSql<number>`CAST(${eb.fn.count("state")} AS INTEGER)`.as("count"),
					])
					.where("state", "=", "mastered"),
			)
			.with("learning_stat_count", (eb) =>
				eb
					.selectFrom("v_and_vrc")
					.select((eb) => [
						kSql<number>`CAST(${eb.fn.count("state")} AS INTEGER)`.as("count"),
					])
					.where("v_and_vrc.state", "=", "learning"),
			)
			.selectFrom("total_words")
			.leftJoin("master_stat_count", (join) => join.onTrue())
			.leftJoin("learning_stat_count", (join) => join.onTrue())
			.select((eb) => [
				kSql<number>`COALESCE(${eb.ref("total_words.count")}, 0)::int`.as(
					"totalWords",
				),
				kSql<number>`COALESCE(${eb.ref("master_stat_count.count")}, 0)::int`.as(
					"masteredWords",
				),
				kSql<number>`COALESCE(${eb.ref("learning_stat_count.count")}, 0)::int`.as(
					"learningWords",
				),
			])
			.executeTakeFirst();

		const totalWords = result?.totalWords ?? 0;
		const masteredWords = result?.masteredWords ?? 0;
		const learningWords = result?.learningWords ?? 0;
		const newWords = Math.max(totalWords - masteredWords - learningWords, 0);

		return {
			totalWords,
			masteredWords,
			newWords,
			learningWords,
		};
	};
});
