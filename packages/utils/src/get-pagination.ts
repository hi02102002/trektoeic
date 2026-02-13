export const getPagination = <TItem>({
	limit,
	page,
	items,
	totalItems,
}: {
	items: TItem[];
	totalItems: number;
	limit: number;
	page: number;
}) => {
	const totalPages = Math.ceil(totalItems / limit);
	const currentPage = page > totalPages ? totalPages : page;
	const itemsPerPage = limit;
	const prevPage = currentPage > 1 ? currentPage - 1 : null;
	const nextPage = currentPage < totalPages ? currentPage + 1 : null;

	return {
		items,
		pagination: {
			totalItems,
			currentPage,
			itemsPerPage,
			totalPages,
			nextPage,
			prevPage,
		},
	};
};
