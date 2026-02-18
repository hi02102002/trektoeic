import z from "zod";

const PaginationInputSchema = z.object({
	page: z.number().min(1).optional().default(1),
	limit: z.number().min(1).default(10),
	items: z.array(z.unknown()),
	totalItems: z.preprocess((val) => Number(val), z.number().int().min(0)),
});

export const getPagination = <TItem>(
	data: z.infer<typeof PaginationInputSchema>,
) => {
	const { items, totalItems, page, limit } = PaginationInputSchema.parse(data);

	const totalPages = Math.ceil(totalItems / limit);
	const currentPage = page > totalPages ? totalPages : page;
	const itemsPerPage = limit;
	const prevPage = currentPage > 1 ? currentPage - 1 : null;
	const nextPage = currentPage < totalPages ? currentPage + 1 : null;

	return {
		items: items as TItem[],
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
