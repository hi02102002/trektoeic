import { sanitizeGrammarLessonHtml } from "@trektoeic/utils/sanitize-grammar-lesson-html";
import { useMemo } from "react";

export function GrammarLessonHtml({ html }: { html: string }) {
	const safe = useMemo(() => sanitizeGrammarLessonHtml(html), [html]);
	if (!safe) return null;

	return (
		<div
			className="grammar-lesson prose prose-sm dark:prose-invert max-w-none text-neutral-700"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: HTML bài học đã sanitize (script/style/on*)
			dangerouslySetInnerHTML={{ __html: safe }}
		/>
	);
}
