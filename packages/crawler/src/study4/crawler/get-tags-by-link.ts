import * as cheerio from "cheerio";
import slugify from "slugify";
import { api } from "../api";

const parseTagName = (name: string) => {
	const match = name.match(/^\[(.+?)\]\s*(.+)$/);
	if (!match) return null;

	const scope = match[1]; // "Part 1" | "Grammar"
	const label = match[2]; // "Tranh tả người" | "Đại từ"

	return { scope, label };
};

function inferGroupKey(scope: string, label: string) {
	if (scope.startsWith("Part")) {
		if (label.startsWith("Câu hỏi")) return "question_type";
		if (label.startsWith("Dạng bài")) return "format";
		if (label.startsWith("Chủ đề")) return "topic";
		if (label.startsWith("Cấu trúc")) return "structure";
		return "description";
	}

	if (scope === "Topic") return "topic";

	if (scope === "Grammar") return "grammar";

	return "other";
}

function inferPart(scope: string): number | null {
	const m = scope.match(/Part\s+(\d+)/);
	return m ? Number(m[1]) : null;
}

type QuestionTag = {
	name: string;
	questions: number[];
	key: string;
	groupKey: string;
	part: number | null;
};

export const getTagsByLink = async (link: string) => {
	const html = await api.get(link).then((res) => res.data);
	const $ = cheerio.load(html);

	const table = $("#nav-tabContent #nav-overview table");
	const tags: QuestionTag[] = [];

	table.find("tbody tr").each((_, el) => {
		const $row = $(el);
		const name = $row.find("td").eq(0).text().trim();
		const questions: number[] = [];

		$row
			.find("td")
			.eq(5)
			.find("a")
			.each((_i, link) => {
				const questionNumber = Number.parseInt($(link).text().trim(), 10);
				if (!Number.isNaN(questionNumber)) {
					questions.push(questionNumber);
				}
			});

		const parsed = parseTagName(name);

		if (!parsed) return;

		const { scope, label } = parsed;
		const groupKey = inferGroupKey(scope as string, label as string);
		const part = inferPart(scope as string);

		tags.push({
			name,
			questions,
			key: slugify(name, {
				lower: true,
				locale: "vi",
				remove: /[*+~.()'"!:@]/g,
			}),
			groupKey,
			part,
		});
	});

	return tags;
};
