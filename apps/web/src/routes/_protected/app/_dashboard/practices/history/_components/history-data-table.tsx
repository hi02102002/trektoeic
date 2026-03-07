"use client";

import type { PartPracticeHistory } from "@trektoeic/schemas/part-practice-schema";
import type { PaginatedResult } from "@trektoeic/schemas/share-schema";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { columns, type HistoryRow } from "./columns";

interface HistoryDataTableProps {
	histories: PaginatedResult<PartPracticeHistory>;
}

export function HistoryDataTable({ histories }: HistoryDataTableProps) {
	const { items, pagination } = histories;

	console.log("items", items);

	const { table } = useDataTable<HistoryRow>({
		data: items,
		columns,
		pageCount: pagination.totalPages,
		getRowId: (row) => row.id,
	});

	return <DataTable table={table} key={JSON.stringify(pagination)} />;
}
