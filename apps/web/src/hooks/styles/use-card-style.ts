import { cn } from "@/lib/utils";

export const useCardStyle = () => {
	return cn(
		"group relative flex h-full flex-col justify-between overflow-hidden rounded-md border border-neutral-200 bg-white p-5 transition-all duration-300",
	);
};
