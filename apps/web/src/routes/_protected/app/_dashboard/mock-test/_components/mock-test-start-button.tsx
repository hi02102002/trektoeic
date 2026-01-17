import { PlayIcon } from "@phosphor-icons/react";
import type { Kit } from "@trektoeic/schemas/kit-schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	kit: Kit;
	className?: string;
};

export const MockTestStartButton = ({ className }: Props) => {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-md border border-border bg-card",
				className,
			)}
		>
			<div className="border-border border-b bg-muted px-5 py-4">
				<h3 className="font-semibold text-foreground text-sm">
					Bắt đầu làm bài
				</h3>
			</div>
			<div className="space-y-4 p-5">
				<p className="text-muted-foreground text-sm">
					Bạn sẽ có 120 phút để hoàn thành 200 câu hỏi. Hãy đảm bảo bạn có đủ
					thời gian và không gian yên tĩnh để làm bài.
				</p>
				<Button
					className="w-full gap-2 font-semibold"
					leadingIcon={<PlayIcon weight="fill" />}
				>
					Bắt đầu làm bài
				</Button>
				<p className="text-center text-muted-foreground/70 text-xs">
					Chức năng này sẽ sớm được ra mắt
				</p>
			</div>
		</div>
	);
};
