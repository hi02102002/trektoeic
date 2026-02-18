import { CheckCircleIcon } from "@phosphor-icons/react";

export function VocabularyReviewEmptyState() {
	return (
		<div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-10 text-center shadow-sm">
			<div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
				<CheckCircleIcon className="size-5" weight="fill" />
			</div>
			<p className="font-semibold text-lg text-neutral-900">
				Không còn thẻ nào đến hạn để ôn tập!
			</p>
			<p className="mt-1 text-neutral-500 text-sm">
				Great job! Quay lại sau để tiếp tục ôn tập các thẻ tiếp theo khi đến hạn
				nhé.
			</p>
		</div>
	);
}
