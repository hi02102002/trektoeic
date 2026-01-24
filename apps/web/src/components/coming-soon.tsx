import { RocketLaunchIcon } from "@phosphor-icons/react";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "./ui/empty";

export const ComingSoon = () => {
	return (
		<Empty className="min-h-[60vh]">
			<EmptyHeader className="max-w-lg">
				<EmptyMedia variant="icon">
					<RocketLaunchIcon weight="duotone" className="size-6" />
				</EmptyMedia>
				<EmptyTitle>Coming Soon</EmptyTitle>
				<EmptyDescription>
					Chúng tôi đang phát triển tính năng này. Vui lòng quay lại sau.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
};
