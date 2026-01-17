import {
	BookIcon,
	ImageIcon,
	MicrophoneIcon,
	NoteIcon,
	PenIcon,
	QuestionIcon,
	UsersIcon,
} from "@phosphor-icons/react";

export const MAP_PART = {
	"1": {
		title: "Mô tả hình ảnh",
		desc: "Phân tích hình ảnh và chọn mô tả chính xác nhất.",
		eng_short: "Photographs",
		Icon: ImageIcon,
		color: "indigo",
		questions: 6,
	},
	"2": {
		title: "Q&A",
		desc: "Lắng nghe các cuộc hội thoại ngắn và trả lời câu hỏi liên quan.",
		eng_short: "Question-Response",
		Icon: QuestionIcon,
		color: "indigo",
		questions: 25,
	},
	"3": {
		title: "Đoạn hội thoại",
		desc: "Nghe các đoạn hội thoại dài hơn và trả lời các câu hỏi chi tiết.",
		eng_short: "Conversations",
		Icon: UsersIcon,
		color: "indigo",
		questions: 39,
	},
	"4": {
		title: "Bài nói chuyện ngắn",
		desc: "Hiểu các bài nói chuyện và trả lời các câu hỏi về nội dung.",
		eng_short: "Talks",
		Icon: MicrophoneIcon,
		color: "indigo",
		questions: 30,
	},
	"5": {
		title: "Điền vào câu",
		desc: "Điền từ hoặc cụm từ còn thiếu để hoàn thành câu đúng ngữ pháp.",
		eng_short: "Incomplete Sentences",
		Icon: PenIcon,
		color: "emerald",
		questions: 30,
	},
	"6": {
		title: "Hoàn thành đoạn văn",
		desc: "Chọn từ hoặc cụm từ phù hợp để hoàn thành đoạn văn.",
		eng_short: "Text Completion",
		Icon: NoteIcon,
		color: "emerald",
		questions: 16,
	},
	"7": {
		title: "Đọc hiểu",
		desc: "Đọc các đoạn văn và trả lời các câu hỏi về nội dung và ý chính.",
		eng_short: "Reading Comprehension",
		Icon: BookIcon,
		color: "emerald",
		questions: 54,
	},
} as const;

export const MAP_PART_PRO_TIPS = [
	[
		"Tập trung vào chi tiết trong hình: vị trí, hành động, số lượng người/vật",
		"Chú ý các từ chỉ trạng thái: is/are + V-ing, has/have been + V-ed",
		"Loại trừ đáp án có từ không xuất hiện trong hình",
		"Không phán đoán điều không chắc chắn (nghề nghiệp, cảm xúc, quan hệ)",
	],
	[
		"Lắng nghe kỹ từ để hỏi: Who, What, Where, When, Why, How",
		"Cẩn thận với câu hỏi Yes/No - đôi khi đáp án không phải Yes/No trực tiếp",
		"Chú ý các câu trả lời gián tiếp hoặc đề nghị thay thế",
		"Tránh chọn đáp án có từ giống câu hỏi (sound-alike trap)",
	],
	[
		"Đọc câu hỏi trước khi nghe để biết thông tin cần tìm",
		"Chú ý đến 5W1H: ai, cái gì, ở đâu, khi nào, tại sao, như thế nào",
		"Lắng nghe các từ khóa về địa điểm, thời gian, mục đích cuộc hội thoại",
		"Tập trung vào phần đầu (chủ đề) và phần cuối (kết luận) của đoạn hội thoại",
	],
	[
		"Xác định loại bài nói: thông báo, quảng cáo, hướng dẫn, tin tức",
		"Câu đầu tiên thường chứa thông tin về chủ đề chính",
		"Chú ý các con số, thời gian, địa điểm được nhắc đến",
		"Nghe kỹ phần kết: thường có lời kêu gọi hành động hoặc thông tin quan trọng",
	],
	[
		"Xác định từ loại cần điền: danh từ, động từ, tính từ, trạng từ",
		"Chú ý ngữ pháp: thì, số ít/số nhiều, chủ động/bị động",
		"Tìm các cụm từ cố định (collocations) và giới từ đi kèm",
		"Đọc cả câu sau khi điền để kiểm tra tính hợp lý",
	],
	[
		"Đọc cả đoạn văn trước để hiểu ngữ cảnh và chủ đề",
		"Chú ý các từ nối (however, therefore, moreover) để hiểu mối liên hệ",
		"Kiểm tra tính nhất quán về thì, đại từ, và logic",
		"Câu điền vào phải hợp lý với câu trước và sau",
	],
	[
		"Đọc câu hỏi trước để biết thông tin cần tìm trong bài",
		"Gạch chân từ khóa trong câu hỏi và tìm synonym trong bài đọc",
		"Đối với câu hỏi main idea, chú ý tiêu đề và câu chủ đề của mỗi đoạn",
		"Đối với NOT/TRUE câu hỏi, kiểm tra từng đáp án với thông tin trong bài",
		"Quản lý thời gian: không dành quá 1 phút cho mỗi câu",
	],
] as const;

export const UNSET_VALUE = "__UNSET_VALUE__";

export const KV_KEYS = {
	PRACTICE_SESSION_CONFIG: "practice-session-config",
};
