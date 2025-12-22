import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import {
	ActionBar,
	ActionBarGroup,
	ActionBarItem,
} from "@/components/ui/action-bar";
import { useCurrentQuestion } from "@/stores/attempt";

export const PracticeActionBar = () => {
	const { canNext, canPrev, next, prev } = useCurrentQuestion((state) => ({
		canNext: state.canNext,
		canPrev: state.canPrev,
		next: state.next,
		prev: state.prev,
		idx: state.idx,
	}));

	return (
		<ActionBar open>
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
		</ActionBar>
	);
};
