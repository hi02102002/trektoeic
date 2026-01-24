import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

const routeApi = getRouteApi(
	"/_protected/app/_practices/mock-test/$slug/$historyId/result-detail",
);

export const ResultActions = () => {
	const [isPending, startTransition] = useTransition();
	const params = routeApi.useParams();
	const navigate = useNavigate();

	const handleRetry = () => {
		startTransition(async () => {
			try {
				await navigate({
					to: "/app/mock-test/$slug/start",
					params: {
						slug: params.slug,
					},
					search: {
						redoFrom: params.historyId,
					},
				});
			} catch {
				toast.error("Có lỗi xảy ra khi làm lại đề thi");
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
					Làm lại đề thi
				</Button>
			</div>
			<LoadingOverlay open={isPending} message="Đang chuẩn bị đề thi mới..." />
		</>
	);
};
