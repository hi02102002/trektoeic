/**
 * Loại bỏ script/style và handler nguy hiểm khỏi HTML bài học; giữ bảng, list, định dạng cơ bản.
 * Dùng cho nội dung HTML bài học crawl trước khi lưu DB / render.
 */
export function sanitizeGrammarLessonHtml(html: string): string {
	if (!html?.trim()) return "";
	return html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
		.replace(/\s(on\w+|formaction)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
		.replace(/javascript:/gi, "")
		.trim();
}
