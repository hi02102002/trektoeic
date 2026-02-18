import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

const buildPaginationItems = (currentPage: number, totalPages: number) => {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	if (currentPage <= 3) {
		return [1, 2, 3, 4, "ellipsis", totalPages] as const;
	}

	if (currentPage >= totalPages - 2) {
		return [
			1,
			"ellipsis",
			totalPages - 3,
			totalPages - 2,
			totalPages - 1,
			totalPages,
		] as const;
	}

	return [
		1,
		"ellipsis",
		currentPage - 1,
		currentPage,
		currentPage + 1,
		"ellipsis",
		totalPages,
	] as const;
};

type PaginationControlsProps = {
	page: number;
	totalPages: number;
	isDisabled?: boolean;
	onPageChange: (page: number) => void;
};

export function PaginationControls({
	page,
	totalPages,
	isDisabled = false,
	onPageChange,
}: PaginationControlsProps) {
	if (totalPages <= 1) return null;

	const isFirstPage = page <= 1;
	const isLastPage = page >= totalPages;
	let ellipsisKey = 0;

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={(event) => {
							event.preventDefault();
							if (isFirstPage || isDisabled) return;
							onPageChange(page - 1);
						}}
						className={
							isFirstPage || isDisabled
								? "pointer-events-none opacity-50"
								: undefined
						}
					/>
				</PaginationItem>

				{buildPaginationItems(page, totalPages).map((item) => {
					if (item === "ellipsis") {
						ellipsisKey += 1;
						return (
							<PaginationItem key={`ellipsis-${ellipsisKey}`}>
								<PaginationEllipsis />
							</PaginationItem>
						);
					}

					return (
						<PaginationItem key={item}>
							<PaginationLink
								href="#"
								isActive={item === page}
								onClick={(event) => {
									event.preventDefault();
									if (isDisabled || item === page) return;
									onPageChange(item);
								}}
							>
								{item}
							</PaginationLink>
						</PaginationItem>
					);
				})}

				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={(event) => {
							event.preventDefault();
							if (isLastPage || isDisabled) return;
							onPageChange(page + 1);
						}}
						className={
							isLastPage || isDisabled
								? "pointer-events-none opacity-50"
								: undefined
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
