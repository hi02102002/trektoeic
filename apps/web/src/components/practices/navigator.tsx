import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";
import { cn } from "@/lib/utils";

export const getButtonNavigatorId = (questionId: string) => {
	return `questions-navigator-question-${questionId}`;
};

export type ButtonNavigatorStatus =
	| "current"
	| "unanswered"
	| "answered"
	| "correct"
	| "wrong";

type Props = {
	groupedQuestions: Array<{
		title: string;
		questions: Array<{
			id: string;
			parentId: string;
			pos: number;
		}>;
	}>;
	mappedQuestions: Record<
		string,
		{
			status: ButtonNavigatorStatus;
			flagged?: boolean;
		}
	>;
	onQuestionClick?: (opts: {
		questionId: string;
		pos: number;
		parentId: string;
	}) => void;
	className?: string;
	mode?: "result" | "practice";
	extra?: ReactNode;
};

export const navigatorButtonVariants = cva(
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
				correct:
					"border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2",
				wrong:
					"border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2",
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

const LegendItem = ({ color, label }: { color: string; label: string }) => {
	return (
		<div className="flex items-center gap-1.5">
			<div className={cn("h-2.5 w-2.5 rounded-full", color)} />
			<span className="text-[10px] text-muted-foreground">{label}</span>
		</div>
	);
};

const NavigatorLegend = ({ mode }: { mode?: Props["mode"] }) => {
	if (mode === "result") {
		return (
			<div className="mt-3 flex items-center gap-4">
				<LegendItem color="border border-green-300 bg-green-100" label="Đúng" />
				<LegendItem color="border border-red-300 bg-red-100" label="Sai" />
			</div>
		);
	}

	return (
		<div className="mt-3 flex items-center gap-4">
			<LegendItem color="bg-primary" label="Hiện tại" />
			<LegendItem
				color="border border-indigo-300 bg-indigo-100"
				label="Đã trả lời"
			/>
			<LegendItem
				color="border border-amber-300 bg-amber-100"
				label="Đánh dấu"
			/>
		</div>
	);
};

export const Navigator = ({
	groupedQuestions,
	mappedQuestions,
	onQuestionClick,
	className,
	extra,
	mode = "practice",
}: Props) => {
	return (
		<aside
			className={cn(
				"hidden w-64 flex-col border-border border-l bg-white xl:flex",
				className,
			)}
		>
			{extra}
			<div className="border-border border-b p-4">
				<h3 className="font-semibold text-primary text-xs uppercase tracking-wider">
					Câu hỏi
				</h3>
				<NavigatorLegend mode={mode} />
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
								{questions.map(({ id, parentId, pos }) => {
									return (
										<NavigatorButton
											key={id}
											id={id}
											elId={`questions-navigator-question-${id}-parent-${parentId}`}
											number={pos}
											status={mappedQuestions[id]?.status || "unanswered"}
											onClick={() => {
												onQuestionClick?.({
													questionId: id,
													pos,
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
