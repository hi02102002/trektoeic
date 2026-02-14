import { Link, useParams } from "@tanstack/react-router";
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
	const { slug } = useParams({
		from: "/_protected/app/_dashboard/vocabularies/$slug/",
	});

	if (totalPages <= 1) return null;

	const isFirstPage = page <= 1;
	const isLastPage = page >= totalPages;
	let ellipsisKey = 0;

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={(event) => {
							event.preventDefault();
							if (!isFirstPage && !isFetchingPage) {
								onPageChange(page - 1);
							}
						}}
						className={
							isFirstPage || isFetchingPage
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
							<PaginationLink isActive={item === page}>
								<Link
									to="/app/vocabularies/$slug"
									params={{ slug }}
									search={{ page: item }}
									className="block flex h-full w-full items-center justify-center"
								>
									{item}
								</Link>
							</PaginationLink>
						</PaginationItem>
					);
				})}
				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={(event) => {
							event.preventDefault();
							if (!isLastPage && !isFetchingPage) {
								onPageChange(page + 1);
							}
						}}
						className={
							isLastPage || isFetchingPage
								? "pointer-events-none opacity-50"
								: undefined
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
