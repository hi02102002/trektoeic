import {
	BookIcon,
	ImageIcon,
	MicrophoneIcon,
	NoteIcon,
	PenIcon,
	QuestionIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import { IconBadge } from "@/components/icon-badge";
import { cn } from "@/lib/utils";

const MAP_PART = {
	"1": {
		title: "Mô tả hình ảnh",
		desc: "Phân tích hình ảnh và chọn mô tả chính xác nhất.",
		Icon: ImageIcon,
		color: "indigo",
	},
	"2": {
		title: "Q&A",
		desc: "Lắng nghe các cuộc hội thoại ngắn và trả lời câu hỏi liên quan.",
		Icon: QuestionIcon,
		color: "indigo",
	},
	"3": {
		title: "Đoạn hội thoại",
		desc: "Nghe các đoạn hội thoại dài hơn và trả lời các câu hỏi chi tiết.",
		Icon: UsersIcon,
		color: "indigo",
	},
	"4": {
		title: "Bài nói chuyện ngắn",
		desc: "Hiểu các bài nói chuyện và trả lời các câu hỏi về nội dung.",
		Icon: MicrophoneIcon,
		color: "indigo",
	},
	"5": {
		title: "Điền vào câu",
		desc: "Điền từ hoặc cụm từ còn thiếu để hoàn thành câu đúng ngữ pháp.",
		Icon: PenIcon,
		color: "emerald",
	},
	"6": {
		title: "Hoàn thành đoạn văn",
		desc: "Chọn từ hoặc cụm từ phù hợp để hoàn thành đoạn văn.",
		Icon: NoteIcon,
		color: "emerald",
	},
	"7": {
		title: "Đọc hiểu",
		desc: "Đọc các đoạn văn và trả lời các câu hỏi về nội dung và ý chính.",
		Icon: BookIcon,
		color: "emerald",
	},
} as const;

const MAP_COLOR = {
	indigo: {
		icon: "group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600",
		hoverText: "group-hover:text-indigo-600",
		wrapper: "hover:border-slate-300 hover:shadow hover:shadow-slate-200/50",
	},
	emerald: {
		icon: "group-hover:border-teal-100 group-hover:bg-teal-50 group-hover:text-teal-600",
		hoverText: "group-hover:text-teal-600",
		wrapper: "hover:border-slate-300 hover:shadow hover:shadow-slate-200/50",
	},
} as const;

export const PartSectionCard = ({
	part,
	totalQuestions,
}: {
	part: keyof typeof MAP_PART;
	totalQuestions?: number;
}) => {
	const { title, desc, Icon, color } = MAP_PART[part];
	const colorClasses = MAP_COLOR[color];
	return (
		<div
			className={cn(
				"group relative flex h-full flex-col justify-between overflow-hidden rounded-sm border border-slate-200 bg-white p-5 transition-all duration-300",
				colorClasses.wrapper,
			)}
		>
			<div>
				<div className="mb-4 flex items-start justify-between">
					<IconBadge color="slate" className={colorClasses.icon}>
						<Icon size={20} weight="duotone" />
					</IconBadge>
					<span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 font-medium text-[10px] text-slate-600">
						Part {part}
					</span>
				</div>
				<h3 className="mb-1 font-semibold text-slate-900 text-sm">{title}</h3>
				<p className="text-slate-500 text-xs">{desc}</p>
			</div>
			<div className="mt-6 border-slate-100 border-t pt-4">
				<div className="flex items-center justify-between text-slate-400 text-xs">
					<span>{totalQuestions ?? "--"} Questions</span>
					<span
						className={cn(
							"flex items-center gap-1 transition-colors",
							colorClasses.hoverText,
						)}
					>
						Start{" "}
						<span
							className="iconify"
							data-icon="lucide:arrow-right"
							data-width="12"
						/>
					</span>
				</div>
			</div>
		</div>
	);
};
