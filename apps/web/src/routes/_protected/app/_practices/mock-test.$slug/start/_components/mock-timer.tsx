import { Timer } from "@/components/practices/timer";
import { DURATION_OF_MOCK_TEST_IN_MINUTES } from "@/constants";

export const MockTimer = () => {
	return (
		<Timer
			mode="down"
			duration={DURATION_OF_MOCK_TEST_IN_MINUTES}
			className="sm:absolute sm:left-1/2 sm:-translate-x-1/2"
			onDone={() => {}}
		/>
	);
};
