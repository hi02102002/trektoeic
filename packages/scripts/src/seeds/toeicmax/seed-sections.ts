import { db, sections, sql } from "@trektoeic/db";
import fs from "fs";
import path from "path";

const main = async () => {
	const data = fs.readFileSync(
		path.join(process.cwd(), "/data/toeic-max-mock-test-sections.json"),
		"utf-8",
	);
	const _data = JSON.parse(data);

	await db.delete(sections).where(sql`true`);

	await db.insert(sections).values(
		_data.map(({ info }: any, index: number) => ({
			name: info.name ?? "",
			intro: info.intro ?? "",
			introAnswer: info.intro_answer ?? "",
			introAudio: info.intro_audio ?? "",
			introImage: info.intro_image ?? "",
			introVi: info.intro_vi ?? "",
			sectionDes: info.section_des ?? "",
			sectionTitle: info.section_title ?? "",
			title: info.title ?? "",
			titleVi: info.title_vi ?? "",
			part: Number(info.name.match(/\d+/)?.[0] ?? index + 1),
		})),
	);
};

main();
