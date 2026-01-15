import { getRouteApi } from "@tanstack/react-router";

const Route = getRouteApi(
	"/_protected/app/_practices/practices/$part/$session-id/results/",
);

export const ResultMainScore = () => {
	const { history } = Route.useLoaderData();

	return (
		<div className="relative overflow-hidden bg-white p-4 text-center">
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent" />
			<div className="relative z-10">
				<h2 className="mb-4 font-medium text-neutral-500 text-sm">
					Kết quả luyện tập
				</h2>
				<div className="mb-2 font-semibold text-6xl text-neutral-900 tracking-tighter">
					{history.metadata.performancePercentile ?? 0}
					<span className="font-normal text-2xl text-neutral-400">%</span>
				</div>
				<div className="space-y-3">
					<div className="flex items-center justify-between text-sm">
						<span className="text-neutral-500">Số câu đúng</span>
						<span className="font-medium text-neutral-900">
							{history.metadata.numberOfCorrectQuestions ?? 0} câu
						</span>
					</div>
					<div className="flex h-2 w-full overflow-hidden rounded-full bg-neutral-100">
						<div
							className="h-full bg-green-500"
							style={{
								width: `${
									((history.metadata.numberOfCorrectQuestions ?? 0) /
										(history.metadata.numberOfQuestions ?? 1)) *
									100
								}%`,
							}}
						/>
						<div
							className="h-full bg-red-500"
							style={{
								width: `${
									((history.metadata.numberOfWrongQuestions ?? 0) /
										(history.metadata.numberOfQuestions ?? 1)) *
									100
								}%`,
							}}
						/>
						<div
							className="h-full bg-neutral-300"
							style={{
								width: `${
									((history.metadata.numberOfUnansweredQuestions ?? 0) /
										(history.metadata.numberOfQuestions ?? 1)) *
									100
								}%`,
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
