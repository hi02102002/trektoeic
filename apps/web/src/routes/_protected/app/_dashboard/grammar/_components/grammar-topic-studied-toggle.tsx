import { CheckCircleIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { orpc } from "@/lib/orpc/orpc";
import { cn } from "@/lib/utils";

type GrammarTopicStudiedToggleProps = {
	slug: string;
	studied: boolean;
};

export function GrammarTopicStudiedToggle({
	slug,
	studied,
}: GrammarTopicStudiedToggleProps) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const mutation = useMutation(
		orpc.grammar.setTopicStudied.mutationOptions({
			onSuccess: async (data) => {
				if (!data.ok) {
					toast.error("Không tìm thấy chủ đề.");
					return;
				}

				const listKey = orpc.grammar.listTopics.queryOptions().queryKey;
				const topicKey = orpc.grammar.getTopicBySlug.queryOptions({
					input: { slug },
				}).queryKey;
				await Promise.all([
					queryClient.refetchQueries({ queryKey: listKey }),
					queryClient.refetchQueries({ queryKey: topicKey }),
				]);

				await router.invalidate();
			},
			onError: () => {
				toast.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
			},
		}),
	);

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			disabled={mutation.isPending}
			leadingIcon={
				studied ? (
					<CheckCircleIcon className="size-3.5" weight="fill" />
				) : undefined
			}
			className={cn(
				studied &&
					"border-emerald-600 bg-emerald-600 text-white hover:border-emerald-700 hover:bg-emerald-700 hover:text-white",
			)}
			onClick={() => mutation.mutate({ slug, studied: !studied })}
		>
			{studied ? "Đã học — bỏ đánh dấu" : "Đánh dấu đã học"}
		</Button>
	);
}
