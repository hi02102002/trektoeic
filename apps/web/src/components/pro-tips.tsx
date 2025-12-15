import { LightbulbIcon } from "@phosphor-icons/react";
import type { Part } from "@trektoeic/schemas/part-section-schema";
import { MAP_PART_PRO_TIPS } from "@/constants";

export const ProTips = ({ part }: { part: Part }) => {
	const tips = MAP_PART_PRO_TIPS[part - 1];

	return (
		<div className="flex gap-4">
			<div className="flex-1 rounded-lg border border-neutral-200 bg-white p-4">
				<div className="flex gap-3">
					<LightbulbIcon className="mt-0.5 shrink-0 text-teal-600" />
					<div>
						<h4 className="font-semibold text-neutral-900 text-xs">Pro Tip</h4>
						<ul className="mt-1 list-disc space-y-1 pl-4 text-neutral-600 text-xs leading-normal">
							{tips.map((tip) => (
								<li key={tip}>{tip}</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
