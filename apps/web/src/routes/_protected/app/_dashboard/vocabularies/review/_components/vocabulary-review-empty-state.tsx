import { CheckCircleIcon } from "@phosphor-icons/react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export function VocabularyReviewEmptyState() {
	const canGoBack = useCanGoBack();
	const router = useRouter();

	const handleBack = () => {
		if (canGoBack) {
			return router.history.back();
		}

		return router.navigate({
			to: "/app/vocabularies",
		});
	};

	return (
		<Empty className="rounded-xl p-10 md:p-10">
			<EmptyHeader className="max-w-xl">
				<EmptyMedia variant="icon">
					<CheckCircleIcon className="size-5" weight="fill" />
				</EmptyMedia>
				<EmptyTitle>Không còn thẻ nào đến hạn để ôn tập!</EmptyTitle>
				<EmptyDescription>
					Great job! Quay lại sau để tiếp tục ôn tập các thẻ tiếp theo khi đến
					hạn nhé.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button variant="outline" size="sm" onClick={handleBack}>
					Quay lại
				</Button>
			</EmptyContent>
		</Empty>
	);
}
