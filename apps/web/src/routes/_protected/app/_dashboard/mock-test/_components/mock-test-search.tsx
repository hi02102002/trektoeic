import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";

type Props = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
};

export const MockTestSearch = ({
	value,
	onChange,
	placeholder = "Tìm kiếm đề thi theo tên...",
}: Props) => {
	return (
		<div className="relative">
			<MagnifyingGlassIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
			<Input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="h-10 pl-10"
			/>
		</div>
	);
};
