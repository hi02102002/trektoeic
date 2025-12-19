import { cva } from "class-variance-authority";
import { Fragment } from "react/jsx-runtime";
import { cn } from "@/lib/utils";

export const getButtonNavigatorId = (questionId: string) => {
	return `questions-navigator-question-${questionId}`;
};

export type ButtonNavigatorStatus =
	| "current"
	| "unanswered"
	| "flagged"
	| "answered";

type Props = {
	groupedQuestions: Array<{
		title: string;
		questions: Array<{
			id: string;
			number: number;
		}>;
	}>;
	mappedQuestions: Record<
		string,
		{
			status: "current" | "unanswered" | "flagged" | "answered";
		}
	>;
};

const navigatorButtonVariants = cva(
	cn(
		"flex aspect-square cursor-pointer items-center justify-center rounded p-0 font-medium text-xs transition-colors",
	),
	{
		variants: {
			status: {
				current:
					"bg-neutral-900 text-white shadow-md hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
				unanswered:
					"border border-border bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2",
				flagged:
					"relative border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2",
				answered:
					"border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2",
			},
		},
	},
);

const NavigatorButton = ({
	id,
	number,
	status,
}: {
	id: string;
	number: number;
	status: ButtonNavigatorStatus;
}) => {
	return (
		<button
			type="button"
			className={navigatorButtonVariants({ status })}
			id={`questions-navigator-question-${id}`}
		>
			{number}
		</button>
	);
};

export const Navigator = ({ groupedQuestions, mappedQuestions }: Props) => {
	return (
		<aside className="hidden w-64 flex-col border-border border-l bg-white xl:flex">
			<div className="border-border border-b p-4">
				<h3 className="font-semibold text-primary text-xs uppercase tracking-wider">
					Câu hỏi
				</h3>
				<div className="mt-3 flex items-center gap-4">
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-primary" />
						<span className="text-[10px] text-muted-foreground">Hiện tại</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full border border-indigo-300 bg-indigo-100" />
						<span className="text-[10px] text-muted-foreground">
							Đã trả lời
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full border border-amber-300 bg-amber-100" />
						<span className="text-[10px] text-muted-foreground">Đánh dấu</span>
					</div>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto p-4">
				<div className="grid grid-cols-5 gap-2">
					{groupedQuestions.map(({ questions, title }) => {
						return (
							<Fragment key={title}>
								<div className="col-span-5 pt-1 pb-1">
									<span className="font-medium text-muted-foreground text-xs">
										{title}
									</span>
								</div>
								{questions.map(({ id, number }) => {
									return (
										<NavigatorButton
											key={id}
											id={id}
											number={number}
											status={mappedQuestions[id]?.status || "unanswered"}
										/>
									);
								})}
							</Fragment>
						);
					})}
				</div>
			</div>
		</aside>
	);
};
