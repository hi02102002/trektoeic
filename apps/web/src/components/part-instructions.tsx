import { PencilRulerIcon } from "@phosphor-icons/react";
import { IconBadge } from "./icon-badge";

export const PartInstructions = ({
	introVi,
	intro,
}: {
	introVi: string;
	intro: string;
}) => {
	return (
		<div className="w-full max-w-5xl rounded-md border border-neutral-200 bg-white p-4">
			<div className="mb-4 flex items-center gap-2 border-neutral-100 border-b pb-4">
				<IconBadge className="size-9">
					<PencilRulerIcon className="size-4" weight="duotone" />
				</IconBadge>
				<h3 className="font-semibold text-primary text-sm">
					Hướng dẫn làm bài
				</h3>
			</div>

			<div className="space-y-4">
				<div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
					<p className="font-medium text-neutral-600 text-xs leading-relaxed">
						<span className="mb-1 block text-neutral-400 text-xs uppercase tracking-wider">
							Tiếng Việt
						</span>
						{introVi}
					</p>
				</div>
				<div className="rounded-md border border-neutral-100 bg-neutral-50 p-4">
					<p className="font-medium text-neutral-600 text-xs leading-relaxed">
						<span className="mb-1 block text-neutral-400 text-xs uppercase tracking-wider">
							English
						</span>
						{intro}
					</p>
				</div>
			</div>
		</div>
	);
};
