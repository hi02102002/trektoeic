import {
	db,
	sql,
	vocabularies,
	vocabularyCategories,
	vocabularyReviewCards,
} from "@trektoeic/db";

const main = async () => {
	console.log("Cleaning vocabulary-related tables...");

	await db.transaction(async (tx) => {
		await tx.delete(vocabularyReviewCards).where(sql`true`);
		await tx.delete(vocabularies).where(sql`true`);
		await tx.delete(vocabularyCategories).where(sql`true`);
	});

	console.log("✅ Vocabulary tables cleaned.");
};

main().catch((err) => {
	console.error("❌ Error cleaning vocabulary tables:", err);
	process.exit(1);
});
