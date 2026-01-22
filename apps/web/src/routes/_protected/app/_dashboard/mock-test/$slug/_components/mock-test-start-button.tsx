import { PlayIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import type { Kit } from "@trektoeic/schemas/kit-schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	kit: Kit;
	className?: string;
};

export const MockTestStartButton = ({ className, kit }: Props) => {
	const navigate = useNavigate();

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
					className="w-full gap-2"
					leadingIcon={<PlayIcon weight="fill" />}
					onClick={() => {
						navigate({
							to: "/app/mock-test/$slug/start",
							params: { slug: kit.slug },
						});
					}}
				>
					Bắt đầu làm bài
				</Button>
			</div>
		</div>
	);
};
