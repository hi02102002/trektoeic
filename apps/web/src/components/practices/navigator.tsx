import { cva } from "class-variance-authority";
import { Fragment } from "react/jsx-runtime";
import { cn } from "@/lib/utils";

export const getButtonNavigatorId = (questionId: string) => {
	return `questions-navigator-question-${questionId}`;
};

export type ButtonNavigatorStatus = "current" | "unanswered" | "answered";

type Props = {
	groupedQuestions: Array<{
		title: string;
		questions: Array<{
			id: string;
			idx: number;
			pIdx: number;
			parentId: string;
		}>;
	}>;
	mappedQuestions: Record<
		string,
		{
			status: "current" | "unanswered" | "answered";
			flagged?: boolean;
		}
	>;
	onQuestionClick?: (opts: {
		questionId: string;
		idx: number;
		pIdx: number;
		parentId: string;
	}) => void;
	className?: string;
};

const navigatorButtonVariants = cva(
	cn(
		"relative flex aspect-square size-8 cursor-pointer items-center justify-center rounded p-0 font-medium text-xs transition-colors",
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
			isFlagged: {
				true: "after:absolute after:-top-1 after:-right-1 after:h-2 after:w-2 after:rounded-full after:bg-amber-500",
			},
		},
	},
);

const NavigatorButton = ({
	number,
	status,
	onClick,
	elId,
	isFlagged,
}: {
	id: string;
	number: number;
	status: ButtonNavigatorStatus;
	onClick?: () => void;
	elId?: string;
	isFlagged?: boolean;
}) => {
	return (
		<button
			type="button"
			id={elId}
			className={navigatorButtonVariants({ status, isFlagged })}
			data-status={status}
			aria-label={`Đi tới câu hỏi ${number}`}
			onClick={onClick}
		>
			{number}
		</button>
	);
};

export const Navigator = ({
	groupedQuestions,
	mappedQuestions,
	onQuestionClick,
	className,
}: Props) => {
	return (
		<aside
			className={cn(
				"hidden w-64 flex-col border-border border-l bg-white xl:flex",
				className,
			)}
		>
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
								<div className="col-span-5">
									<span className="font-medium text-muted-foreground text-xs">
										{title}
									</span>
								</div>
								{questions.map(({ id, idx, pIdx, parentId }) => {
									return (
										<NavigatorButton
											key={id}
											id={id}
											elId={`questions-navigator-question-${id}-parent-${parentId}`}
											number={idx + 1}
											status={mappedQuestions[id]?.status || "unanswered"}
											onClick={() => {
												onQuestionClick?.({
													questionId: id,
													idx: pIdx,
													pIdx,
													parentId,
												});
											}}
											isFlagged={mappedQuestions[id]?.flagged}
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
