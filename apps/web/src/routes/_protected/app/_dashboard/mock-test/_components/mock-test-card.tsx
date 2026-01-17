import { BookOpenIcon, ClockIcon, QuestionIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { Kit } from "@trektoeic/schemas/kit-schema";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useCardStyle } from "@/hooks/styles/use-card-style";
import { cn } from "@/lib/utils";

export type MockTest = {
	id: string;
	name: string;
	slug: string;
	year: number;
	duration: number; // in minutes
	totalQuestions: number;
	totalParts: number;
	views?: number;
	tags?: string[];
};

type Props = {
	kit: Kit;
	className?: string;
};

const TAGS = ["TOEIC", "ETS"];

export const MockTestCard = ({ kit, className }: Props) => {
	const style = useCardStyle();
	return (
		<div className={cn(style, className)}>
			<div className="mb-4">
				<h3 className="mb-1 font-semibold text-neutral-900 text-sm">
					{kit.name}
				</h3>
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex flex-wrap gap-x-4 gap-y-2 text-neutral-500 text-sm">
					<div className="flex items-center gap-1.5">
						<ClockIcon className="size-4" />
						<span>120 phút</span>
					</div>
				</div>
				<div className="flex flex-wrap gap-x-4 gap-y-2 text-neutral-500 text-sm">
					<div className="flex items-center gap-1.5">
						<BookOpenIcon className="size-4" />
						<span>7 phần thi</span>
					</div>
					<div className="flex items-center gap-1.5">
						<QuestionIcon className="size-4" />
						<span>200 câu hỏi</span>
					</div>
				</div>
				<div className="flex flex-wrap gap-2">
					{TAGS.map((tag) => (
						<Badge
							key={tag}
							variant="secondary"
							className="rounded-md bg-neutral-100 px-2 py-0.5 font-normal text-neutral-600 text-xs"
						>
							#{tag}
						</Badge>
					))}
				</div>
			</div>
			<Link
				className={buttonVariants({
					size: "sm",
					className: "mt-4",
				})}
				to="/app/mock-test/$slug"
				params={{ slug: kit.slug }}
			>
				Xem chi tiết
			</Link>
		</div>
	);
};
