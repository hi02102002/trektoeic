import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import {
	ActionBarGroup,
	ActionBarItem,
	ActionBar as ActionBarUI,
} from "@/components/ui/action-bar";

type Props = {
	canNext: () => boolean;
	canPrev: () => boolean;
	next: () => void;
	prev: () => void;
};

export const ActionBar = ({ canNext, canPrev, next, prev }: Props) => {
	return (
		<ActionBarUI open>
			<ActionBarGroup>
				<ActionBarItem disabled={!canPrev?.()} onSelect={prev}>
					<ArrowLeftIcon />
					Câu trước
				</ActionBarItem>
				<ActionBarItem
					variant="default"
					disabled={!canNext?.()}
					onSelect={next}
				>
					Câu tiếp theo
					<ArrowRightIcon />
				</ActionBarItem>
			</ActionBarGroup>
		</ActionBarUI>
	);
};
