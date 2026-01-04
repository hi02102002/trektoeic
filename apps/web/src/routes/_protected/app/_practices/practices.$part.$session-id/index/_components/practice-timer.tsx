import { getRouteApi } from "@tanstack/react-router";
import { Timer } from "@/components/practices/timer";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useSubmitPractice } from "../_hooks/use-submit-practice";

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$session-id/",
);

export const PracticeTimer = () => {
	const search = Route.useSearch();
	const { handleSubmit, isPending } = useSubmitPractice();

	return (
		<>
			<LoadingOverlay open={isPending} message="Bạn chờ chút nhé..." />
			{search?.mode === "timed" ? (
				<Timer
					mode="down"
					duration={search?.duration ?? 0}
					onDone={handleSubmit}
					className="sm:absolute sm:left-1/2 sm:-translate-x-1/2"
				/>
			) : (
				<Timer
					mode="up"
					className="sm:absolute sm:left-1/2 sm:-translate-x-1/2"
				/>
			)}
		</>
	);
};
