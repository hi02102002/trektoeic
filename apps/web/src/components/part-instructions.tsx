import { PencilRulerIcon } from "@phosphor-icons/react";
import { IconBadge } from "./icon-badge";
import { Card, CardContent, CardHeader } from "./ui/card";

export const PartInstructions = ({
	introVi,
	intro,
}: {
	introVi: string;
	intro: string;
}) => {
	return (
		<Card className="w-full max-w-5xl rounded-md border border-neutral-200 bg-white ring-0">
			<CardHeader className="mb-0 border-neutral-100 border-b pb-4">
				<div className="flex items-center gap-2">
					<IconBadge className="size-9">
						<PencilRulerIcon className="size-4" weight="duotone" />
					</IconBadge>
					<h3 className="font-semibold text-primary text-sm">
						Hướng dẫn làm bài
					</h3>
				</div>
			</CardHeader>

			<CardContent className="space-y-4 py-4">
				<Card
					size="sm"
					className="rounded-lg border border-neutral-100 bg-neutral-50 ring-0"
				>
					<CardContent className="py-4">
						<p className="font-medium text-neutral-600 text-xs leading-relaxed">
							<span className="mb-1 block text-neutral-400 text-xs uppercase tracking-wider">
								Tiếng Việt
							</span>
							{introVi}
						</p>
					</CardContent>
				</Card>
				<Card
					size="sm"
					className="rounded-md border border-neutral-100 bg-neutral-50 ring-0"
				>
					<CardContent className="py-4">
						<p className="font-medium text-neutral-600 text-xs leading-relaxed">
							<span className="mb-1 block text-neutral-400 text-xs uppercase tracking-wider">
								English
							</span>
							{intro}
						</p>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};
