import { getRouteApi } from "@tanstack/react-router";
import { Timer } from "@/components/practices/timer";

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$session-id/",
);

export const PracticeTimer = () => {
	const search = Route.useSearch();

	return search?.mode === "timed" ? (
		<Timer
			mode="down"
			duration={search.duration ?? 0}
			onDone={() => {
				// will be handle
			}}
			className="absolute left-1/2 -translate-x-1/2 transform"
		/>
	) : (
		<Timer mode="up" className="absolute left-1/2 -translate-x-1/2 transform" />
	);
};
