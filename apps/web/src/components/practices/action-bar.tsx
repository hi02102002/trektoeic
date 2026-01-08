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
	finalText?: string;
};

export const ActionBar = ({
	canPrev,
	next,
	prev,
	finalText = "Hoàn thành",
	canNext,
}: Props) => {
	return (
		<ActionBarUI open>
			<ActionBarGroup>
				<ActionBarItem disabled={!canPrev?.()} onSelect={prev}>
					<ArrowLeftIcon />
					Câu trước
				</ActionBarItem>
				<ActionBarItem variant="default" onSelect={next}>
					{canNext() ? "Câu tiếp" : finalText}
					<ArrowRightIcon />
				</ActionBarItem>
			</ActionBarGroup>
		</ActionBarUI>
	);
};
