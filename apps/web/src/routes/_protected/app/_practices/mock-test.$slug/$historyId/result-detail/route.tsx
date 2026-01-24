import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute(
	"/_protected/app/_practices/mock-test/$slug/$historyId/result-detail",
)({
	validateSearch: z.object({
		subQuestionId: z.string().optional(),
		questionId: z.string().optional(),
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>Hello "/_protected/app/_practices/mock-test/$slug/result-detail"!</div>
	);
}
