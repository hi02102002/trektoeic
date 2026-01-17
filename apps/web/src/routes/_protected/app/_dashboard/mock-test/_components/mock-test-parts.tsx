import { IconBadge } from "@/components/icon-badge";
import { MAP_PART } from "@/constants";

export const MockTestParts = () => {
	return (
		<div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
			<div className="border-neutral-200 border-b bg-neutral-50 px-5 py-4">
				<h3 className="font-semibold text-neutral-900 text-sm">
					Cấu trúc đề thi
				</h3>
			</div>
			<div className="divide-y divide-neutral-100">
				{Object.values(MAP_PART).map((part, index) => (
					<div
						key={part.title}
						className="flex items-center justify-between px-5 py-3"
					>
						<div className="flex items-center gap-3">
							<IconBadge color={part.color} className="size-9">
								<part.Icon weight="duotone" />
							</IconBadge>
							<div>
								<p className="font-medium text-neutral-900 text-sm">
									Part {index + 1}: {part.title}
								</p>
								<p className="text-neutral-500 text-xs">{part.eng_short}</p>
							</div>
						</div>
						<span className="font-medium text-neutral-600 text-sm">
							{part.questions} câu
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
