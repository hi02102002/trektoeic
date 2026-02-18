import { PaginationControls } from "@/components/pagination-controls";

type VocabularyPaginationProps = {
	page: number;
	totalPages: number;
	isFetchingPage?: boolean;
	onPageChange: (page: number) => void;
};

export function VocabularyPagination({
	page,
	totalPages,
	isFetchingPage = false,
	onPageChange,
}: VocabularyPaginationProps) {
	return (
		<PaginationControls
			page={page}
			totalPages={totalPages}
			isDisabled={isFetchingPage}
			onPageChange={onPageChange}
		/>
	);
}
