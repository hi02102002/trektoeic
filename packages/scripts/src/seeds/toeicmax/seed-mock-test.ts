import { db, kits, questions, sql, subQuestions } from "@trektoeic/db";
import fs from "fs";
import path from "path";

const main = async () => {
	const data = fs.readFileSync(
		path.join(process.cwd(), "/data/toiec-max-mock-tests.json"),
		"utf-8",
	);
	const mockTest = JSON.parse(data);

	await db.transaction(async (tx) => {
		await tx.delete(subQuestions).where(sql`true`);
		await tx.delete(questions).where(sql`true`);
		await tx.delete(kits).where(sql`true`);

		for (const kit of mockTest) {
			const [insertedKit] = await tx
				.insert(kits)
				.values({
					name: kit.name,
					slug: kit.slug,
					year: kit.year,
				})
				.returning({
					id: kits.id,
				});

			console.log(`Inserted kit: ${insertedKit?.id} - ${kit.name}`);

			if (!insertedKit) throw new Error("Failed to insert kit");

			for (const question of kit.questions) {
				const [insertedQuestion] = await tx
					.insert(questions)
					.values({
						part: question.part,
						kitId: insertedKit.id,
						position: question.vitri,
						audioUrl: question.audio_url || null,
						imageUrl: question.image_url.join(","),
						teaser: question.teaser,
						total: question.count,
					})
					.returning({
						id: questions.id,
					});

				if (!insertedQuestion) throw new Error("Failed to insert question");
				console.log(
					`  Inserted question: ${insertedQuestion.id} - Part ${question.part} Position ${question.vitri}`,
				);

				await tx.insert(subQuestions).values(
					question.question.map((sub: any) => {
						return {
							questionId: insertedQuestion.id,
							question: sub.q ?? "",
							options: sub.opt,
							ans: sub.ans,
							translation: sub.tran,
							position: sub.vitri,
						};
					}),
				);
			}
		}
	});
};

main();
