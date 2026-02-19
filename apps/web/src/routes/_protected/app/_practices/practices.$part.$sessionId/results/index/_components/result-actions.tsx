import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { client } from "@/lib/orpc/orpc";

const routeApi = getRouteApi(
	"/_protected/app/_practices/practices/$part/$sessionId/results/",
);

export const ResultActions = () => {
	const [isPending, startTransition] = useTransition();
	const params = routeApi.useParams();
	const { history } = routeApi.useLoaderData();
	const navigate = useNavigate();

	const handleRetry = () => {
		startTransition(async () => {
			try {
				const result = await client.partPractices.redoPartPractices({
					historyId: params["sessionId"],
				});

				if (!result) {
					toast.error("Không tìm thấy bài luyện tập để làm lại");
					return;
				}

				navigate({
					to: "/app/practices/$part/$sessionId",
					params: {
						part: params.part,
						sessionId: result.cacheKey,
					},
					search: {
						mode: history.metadata.mode,
						numberOfQuestions: result.questions.length,
						duration:
							history.metadata.mode === "timed"
								? history.metadata.duration
								: undefined,
					},
				});
			} catch {
				toast.error("Có lỗi xảy ra khi làm lại bài luyện tập");
			}
		});
	};

	return (
		<>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={handleRetry}
					leadingIcon={<ArrowCounterClockwiseIcon />}
				>
					Làm lại
				</Button>
			</div>
			<LoadingOverlay
				open={isPending}
				message="Đang chuẩn bị bài luyện tập..."
			/>
		</>
	);
};
