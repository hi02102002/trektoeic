import { z } from "zod";

const correctIndex4 = z.union([
	z.literal(0),
	z.literal(1),
	z.literal(2),
	z.literal(3),
]);

/** Trắc nghiệm 4 lựa chọn (type_ex "1"). */
export const GrammarExerciseMcq4Schema = z.object({
	kind: z.literal("mcq4"),
	id: z.string(),
	prompt: z.string(),
	options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
	correctIndex: correctIndex4,
	explanation: z.string(),
});

/** Hai lựa chọn a/b (ToeicMax type_ex "3"). */
export const GrammarExerciseMcq2Schema = z.object({
	kind: z.literal("mcq2"),
	id: z.string(),
	prompt: z.string(),
	options: z.tuple([z.string(), z.string()]),
	correctIndex: z.union([z.literal(0), z.literal(1)]),
	explanation: z.string(),
});

/** Điền từ theo gợi ý (type_ex "4"). */
export const GrammarExerciseFillSchema = z.object({
	kind: z.literal("fill"),
	id: z.string(),
	prompt: z.string(),
	answer: z.string(),
	hintKeyword: z.string().nullable().optional(),
	explanation: z.string(),
});

/** JSON seed cũ: 4 đáp án, không có field `kind`. */
const LegacyGrammarMcq4Schema = z
	.object({
		id: z.string(),
		prompt: z.string(),
		options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
		correctIndex: correctIndex4,
		explanation: z.string(),
	})
	.transform((x) => ({ kind: "mcq4" as const, ...x }));

export const GrammarExerciseSchema = z.union([
	GrammarExerciseMcq4Schema,
	GrammarExerciseMcq2Schema,
	GrammarExerciseFillSchema,
	LegacyGrammarMcq4Schema,
]);
export type GrammarExercise = z.infer<typeof GrammarExerciseSchema>;

export const GrammarSectionSchema = z.object({
	heading: z.string(),
	body: z.array(z.string()),
});
export type GrammarSection = z.infer<typeof GrammarSectionSchema>;

export const GrammarTopicSchema = z.object({
	slug: z.string(),
	title: z.string(),
	description: z.string(),
	/** HTML lý thuyết gốc; khi có, ưu tiên hiển thị kèm styling bảng. */
	lessonHtml: z.string().nullable().default(null),
	exerciseTypeName: z.string().default(""),
	exerciseTypeDes: z.string().default(""),
	relatedParts: z.array(z.number().int().min(1).max(7)),
	sections: z.array(GrammarSectionSchema),
	exercises: z.array(GrammarExerciseSchema),
});
export type GrammarTopic = z.infer<typeof GrammarTopicSchema>;

/** Dòng trên trang danh sách chủ đề (không kèm sections/exercises). */
export const GrammarTopicSummarySchema = z.object({
	slug: z.string(),
	title: z.string(),
	description: z.string(),
	relatedParts: z.array(z.number().int().min(1).max(7)),
	exerciseCount: z.number().int().nonnegative(),
	courseSlug: z.string(),
	courseTitle: z.string(),
});
export type GrammarTopicSummary = z.infer<typeof GrammarTopicSummarySchema>;

const GrammarCourseTrekSchema = z.object({
	id: z.string().optional(),
	slug: z.string(),
	title: z.string(),
	description: z.string().optional().default(""),
	topics: z.array(GrammarTopicSchema),
});

/** File JSON chuẩn nội bộ: một hoặc nhiều "khóa" course, mỗi khóa có danh sách chủ đề. */
export const GrammarCoursesTrekFileSchema = z.object({
	format: z.literal("trektoiec-v1"),
	courses: z.array(GrammarCourseTrekSchema).min(1),
});
export type GrammarCoursesTrekFile = z.infer<
	typeof GrammarCoursesTrekFileSchema
>;

/**
 * Một object course thô từ nguồn crawl — map trong app bằng
 * `extractGrammarTopicsFromToeicMaxCourse`. Cấu trúc field có thể khác theo phiên bản API;
 * chỉnh mapper nếu JSON của bạn dùng tên field khác.
 */
export const GrammarCoursesToeicMaxFileSchema = z.object({
	format: z.literal("toeicmax-course-v1"),
	course: z.record(z.string(), z.unknown()),
});
export type GrammarCoursesToeicMaxFile = z.infer<
	typeof GrammarCoursesToeicMaxFileSchema
>;

export const GrammarCoursesFileSchema = z.discriminatedUnion("format", [
	GrammarCoursesTrekFileSchema,
	GrammarCoursesToeicMaxFileSchema,
]);
export type GrammarCoursesFile = z.infer<typeof GrammarCoursesFileSchema>;

/** File seed JSON: `{ "courses": [...] }` (không bắt buộc field `format`). */
export const GrammarSeedFileSchema = z.object({
	courses: z.array(GrammarCourseTrekSchema).min(1),
});
export type GrammarSeedFile = z.infer<typeof GrammarSeedFileSchema>;
