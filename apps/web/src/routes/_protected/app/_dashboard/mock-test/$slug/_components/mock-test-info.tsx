import {
	BookOpenIcon,
	ClockIcon,
	HeadphonesIcon,
	PencilSimpleLineIcon,
	QuestionIcon,
} from "@phosphor-icons/react";
import type { Kit } from "@trektoeic/schemas/kit-schema";

type Props = {
	kit: Kit;
};

export const MockTestInfo = (_props: Props) => {
	return (
		<div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
			<div className="border-neutral-200 border-b bg-neutral-50 px-5 py-4">
				<h3 className="font-semibold text-neutral-900 text-sm">
					Thông tin đề thi
				</h3>
			</div>
			<div className="space-y-4 p-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<ClockIcon className="size-4 text-neutral-500" weight="duotone" />
						<span className="text-neutral-600 text-sm">Thời gian</span>
					</div>
					<span className="font-medium text-neutral-900 text-sm">120 phút</span>
				</div>
				<div className="border-neutral-100 border-t" />
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<QuestionIcon
							className="size-4 text-neutral-500"
							weight="duotone"
						/>
						<span className="text-neutral-600 text-sm">Số câu hỏi</span>
					</div>
					<span className="font-medium text-neutral-900 text-sm">200 câu</span>
				</div>
				<div className="border-neutral-100 border-t" />
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<BookOpenIcon
							className="size-4 text-neutral-500"
							weight="duotone"
						/>
						<span className="text-neutral-600 text-sm">Số phần thi</span>
					</div>
					<span className="font-medium text-neutral-900 text-sm">7 phần</span>
				</div>
				<div className="border-neutral-100 border-t" />
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<HeadphonesIcon
							className="size-4 text-neutral-500"
							weight="duotone"
						/>
						<span className="text-neutral-600 text-sm">Listening</span>
					</div>
					<span className="font-medium text-neutral-900 text-sm">
						Part 1-4 (100 câu)
					</span>
				</div>
				<div className="border-neutral-100 border-t" />
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<PencilSimpleLineIcon
							className="size-4 text-neutral-500"
							weight="duotone"
						/>
						<span className="text-neutral-600 text-sm">Reading</span>
					</div>
					<span className="font-medium text-neutral-900 text-sm">
						Part 5-7 (100 câu)
					</span>
				</div>
			</div>
		</div>
	);
};
