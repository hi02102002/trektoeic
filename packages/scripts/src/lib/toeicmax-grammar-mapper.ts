/**
 * Chuyển dump JSON khóa học (`toiecmax-courses.json`) sang định dạng seed grammar:
 * HTML lý thuyết + bài tập type 1 (4 đáp án), type 3 (2 đáp án), type 4 (điền từ).
 */
import type {
	GrammarExercise,
	GrammarSeedFile,
	GrammarTopic,
} from "@trektoeic/schemas/grammar-course-file-schema";
import { sanitizeGrammarLessonHtml } from "@trektoeic/utils/sanitize-grammar-lesson-html";

type RawOpt = { a?: string; b?: string; c?: string; d?: string };

type RawMeta = {
	q?: string;
	opt?: RawOpt;
	ans?: string;
	keyword?: string | null;
	tran?: { vi?: string | null };
	explain?: { vi?: string | null; gpt?: string | null };
};

type RawExerciseItem = {
	id?: number;
	type_ex?: string;
	meta_data?: RawMeta;
};

type RawLesson = {
	id?: number;
	name?: string;
	slug?: string;
	introduction?: string | null;
	type_exercise?: { id?: number; name?: string; des?: string };
};

type RawTopic = {
	id: number;
	name?: string;
	subs?: RawTopic[];
	lesson?: RawLesson;
	exercise?: RawExerciseItem[];
};

type RawCourse = {
	id: number;
	name?: string;
	slug?: string;
	list_topic?: RawTopic[];
};

function stripHtmlToParagraphs(html: string): string[] {
	if (!html?.trim()) return [];
	const withBreaks = html
		.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
		.replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&#39;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, "&");
	const parts = withBreaks
		.split(/\n+/)
		.map((s) => s.replace(/\s+/g, " ").trim())
		.filter((s) => s.length > 0);
	if (parts.length === 0) {
		const one = withBreaks.replace(/\s+/g, " ").trim();
		return one ? [one.slice(0, 12_000)] : [];
	}
	return parts.slice(0, 120);
}

function buildExplanation(meta: RawMeta | undefined): string {
	return (
		[meta?.explain?.vi, meta?.explain?.gpt, meta?.tran?.vi]
			.map((x) => (typeof x === "string" && x.trim() ? x.trim() : ""))
			.find(Boolean) ?? ""
	);
}

function mapType1Single(
	item: RawExerciseItem,
	fallbackSeq: number,
): GrammarExercise | null {
	if (String(item.type_ex) !== "1") return null;
	const meta = item.meta_data;
	if (!meta?.opt || typeof meta.q !== "string") return null;
	const { a, b, c, d } = meta.opt;
	if (
		typeof a !== "string" ||
		typeof b !== "string" ||
		typeof c !== "string" ||
		typeof d !== "string"
	) {
		return null;
	}
	const letterToIndex: Record<string, 0 | 1 | 2 | 3> = {
		a: 0,
		b: 1,
		c: 2,
		d: 3,
	};
	const ans = String(meta.ans ?? "")
		.trim()
		.toLowerCase();
	const correctIndex = letterToIndex[ans];
	if (correctIndex === undefined) return null;

	return {
		kind: "mcq4",
		id: `tm-${item.id ?? fallbackSeq}`,
		prompt: meta.q.trim(),
		options: [a, b, c, d],
		correctIndex,
		explanation: buildExplanation(meta),
	};
}

function mapType3Single(
	item: RawExerciseItem,
	fallbackSeq: number,
): GrammarExercise | null {
	if (String(item.type_ex) !== "3") return null;
	const meta = item.meta_data;
	if (!meta?.opt || typeof meta.q !== "string") return null;
	const { a, b } = meta.opt;
	if (typeof a !== "string" || typeof b !== "string") return null;
	const ans = String(meta.ans ?? "")
		.trim()
		.toLowerCase();
	const correctIndex = ans === "a" ? 0 : ans === "b" ? 1 : undefined;
	if (correctIndex === undefined) return null;

	return {
		kind: "mcq2",
		id: `tm-${item.id ?? fallbackSeq}`,
		prompt: meta.q.trim(),
		options: [a, b],
		correctIndex,
		explanation: buildExplanation(meta),
	};
}

function mapType4Single(
	item: RawExerciseItem,
	fallbackSeq: number,
): GrammarExercise | null {
	if (String(item.type_ex) !== "4") return null;
	const meta = item.meta_data;
	if (typeof meta?.q !== "string" || typeof meta?.ans !== "string") return null;
	const answer = meta.ans.trim();
	if (!answer) return null;
	const kw = meta.keyword;
	const hintKeyword =
		typeof kw === "string" && kw.trim().length > 0 ? kw.trim() : null;

	return {
		kind: "fill",
		id: `tm-${item.id ?? fallbackSeq}`,
		prompt: meta.q.trim(),
		answer,
		hintKeyword,
		explanation: buildExplanation(meta),
	};
}

function mapAllExercises(
	raw: RawExerciseItem[] | undefined,
): GrammarExercise[] {
	if (!Array.isArray(raw)) return [];
	const out: GrammarExercise[] = [];
	let seq = 0;
	for (const item of raw) {
		const t = String(item.type_ex ?? "");
		let ex: GrammarExercise | null = null;
		if (t === "1") ex = mapType1Single(item, seq);
		else if (t === "3") ex = mapType3Single(item, seq);
		else if (t === "4") ex = mapType4Single(item, seq);
		if (ex) {
			out.push(ex);
			seq += 1;
		}
	}
	return out;
}

function topicSlug(courseId: number, topic: RawTopic): string {
	const lesson = topic.lesson;
	const base =
		lesson?.slug && lesson.slug.trim().length > 0
			? lesson.slug.trim()
			: `id-${topic.id}`;
	const cleaned = `${courseId}-${base}`
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
	return cleaned || `c${courseId}-t${topic.id}`;
}

function walkTopics(
	list: RawTopic[] | undefined,
	visit: (t: RawTopic) => void,
) {
	if (!list?.length) return;
	for (const t of list) {
		visit(t);
		walkTopics(t.subs, visit);
	}
}

export type MapToeicMaxGrammarOptions = {
	/** Lọc theo `course.id`; không set = tất cả khóa trong file */
	courseIds?: number[];
};

export function mapToeicMaxCoursesToGrammarSeed(
	raw: unknown,
	options: MapToeicMaxGrammarOptions = {},
): GrammarSeedFile {
	if (!Array.isArray(raw)) {
		throw new Error(
			"File JSON khóa học ngữ pháp phải là mảng các course ở root.",
		);
	}

	const coursesRaw = raw as RawCourse[];
	const idFilter = options.courseIds?.length
		? new Set(options.courseIds)
		: null;

	const coursesOut: GrammarSeedFile["courses"] = [];

	for (const course of coursesRaw) {
		if (typeof course?.id !== "number") continue;
		if (idFilter && !idFilter.has(course.id)) continue;

		const slug =
			typeof course.slug === "string" && course.slug.trim()
				? course.slug.trim()
				: `course-${course.id}`;
		const title =
			typeof course.name === "string" && course.name.trim()
				? course.name.trim()
				: `Course ${course.id}`;

		const topics: GrammarTopic[] = [];
		const seenSlugs = new Set<string>();

		walkTopics(course.list_topic, (node) => {
			const intro = node.lesson?.introduction?.trim() ?? "";
			const exercises = mapAllExercises(node.exercise);
			if (!intro && exercises.length === 0) return;

			const titleVi =
				node.lesson?.name?.trim() || node.name?.trim() || `Topic ${node.id}`;
			const lessonHtml = intro ? sanitizeGrammarLessonHtml(intro) : null;
			const body = stripHtmlToParagraphs(intro);
			const sections =
				lessonHtml && lessonHtml.length > 0
					? []
					: body.length > 0
						? [{ heading: "Nội dung", body }]
						: [{ heading: "Bài tập", body: ["Làm các câu bên dưới."] }];

			const tex = node.lesson?.type_exercise;
			const exerciseTypeName =
				typeof tex?.name === "string" ? tex.name.trim() : "";
			const exerciseTypeDes =
				typeof tex?.des === "string" ? tex.des.trim() : "";

			const desc =
				body[0]?.slice(0, 280) ?? `${exercises.length} câu trắc nghiệm Part 5.`;

			let slugOut = topicSlug(course.id, node);
			if (seenSlugs.has(slugOut)) slugOut = `${slugOut}-n${node.id}`;
			seenSlugs.add(slugOut);

			topics.push({
				slug: slugOut,
				title: titleVi,
				description: desc,
				lessonHtml: lessonHtml && lessonHtml.length > 0 ? lessonHtml : null,
				exerciseTypeName,
				exerciseTypeDes,
				relatedParts: [5],
				sections,
				exercises,
			});
		});

		if (topics.length === 0) continue;

		coursesOut.push({
			slug,
			title,
			description: `Khóa gồm ${topics.length} chủ đề — lý thuyết và bài tập.`,
			topics,
		});
	}

	if (coursesOut.length === 0) {
		throw new Error(
			"Không map được chủ đề nào. Kiểm tra file JSON, courseIds, hoặc dữ liệu lesson/exercise.",
		);
	}

	return { courses: coursesOut };
}
