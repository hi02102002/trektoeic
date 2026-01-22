import {
	CheckCircleIcon,
	InfoIcon,
	LightbulbIcon,
	WarningIcon,
} from "@phosphor-icons/react";
import { IconBadge } from "@/components/icon-badge";

const INSTRUCTIONS = [
	{
		icon: InfoIcon,
		title: "Cấu trúc đề thi",
		content:
			"Đề thi TOEIC gồm 2 phần: Listening (45 phút, 100 câu) và Reading (75 phút, 100 câu). Tổng thời gian làm bài là 120 phút.",
	},
	{
		icon: CheckCircleIcon,
		title: "Cách tính điểm",
		content:
			"Mỗi câu trả lời đúng được 5 điểm. Không trừ điểm câu sai. Tổng điểm từ 10-990.",
	},
	{
		icon: WarningIcon,
		title: "Lưu ý quan trọng",
		content:
			"Trong phần Listening, audio chỉ được phát một lần. Hãy tập trung lắng nghe và trả lời ngay.",
	},
	{
		icon: LightbulbIcon,
		title: "Mẹo làm bài",
		content:
			"Đừng dành quá nhiều thời gian cho một câu. Nếu không chắc, hãy đánh dấu và quay lại sau.",
	},
];

export const MockTestInstructions = () => {
	return (
		<div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
			<div className="border-neutral-200 border-b bg-neutral-50 px-5 py-4">
				<h3 className="font-semibold text-neutral-900 text-sm">
					Hướng dẫn làm bài
				</h3>
			</div>
			<div className="space-y-4 p-5">
				{INSTRUCTIONS.map((instruction, index) => (
					<div key={index} className="flex gap-3">
						<IconBadge className="size-9" color="neutral">
							<instruction.icon weight="duotone" />
						</IconBadge>
						<div className="flex-1">
							<h4 className="mb-1 font-medium text-neutral-900 text-sm">
								{instruction.title}
							</h4>
							<p className="text-neutral-500 text-sm leading-relaxed">
								{instruction.content}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
