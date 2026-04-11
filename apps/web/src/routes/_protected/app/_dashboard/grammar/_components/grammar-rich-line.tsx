import type { ReactNode } from "react";

/** Minimal **bold** and *italic* for curated grammar copy (no nested markers). */
export function GrammarRichLine({ text }: { text: string }): ReactNode {
	const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
	const nodes: ReactNode[] = [];
	let last = 0;
	let key = 0;
	for (;;) {
		const m = re.exec(text);
		if (m === null) break;
		if (m.index > last) {
			nodes.push(text.slice(last, m.index));
		}
		if (m[1] !== undefined) {
			nodes.push(
				<strong key={key++} className="font-semibold text-neutral-900">
					{m[1]}
				</strong>,
			);
		} else if (m[2] !== undefined) {
			nodes.push(<em key={key++}>{m[2]}</em>);
		}
		last = re.lastIndex;
	}
	if (last < text.length) {
		nodes.push(text.slice(last));
	}
	return nodes;
}
