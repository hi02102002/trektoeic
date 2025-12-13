import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export const useTotalQuestionsEachPart = () => {
	return useQuery(
		orpc.questions.getTotalQuestionsEachPart.queryOptions({
			select(data) {
				return data.reduce(
					(acc, curr) => {
						acc[curr.part] = curr.totalQuestions;
						return acc;
					},
					{} as Record<string, number>,
				);
			},
		}),
	);
};
