"use client";

import type { MockTestHistoryListItem } from "@trektoeic/schemas/mock-test-schema";
import type { PaginatedResult } from "@trektoeic/schemas/share-schema";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { columns, type HistoryRow } from "./columns";

interface MockTestHistoryDataTableProps {
	histories: PaginatedResult<MockTestHistoryListItem>;
}

export function MockTestHistoryDataTable({
	histories,
}: MockTestHistoryDataTableProps) {
	const { items, pagination } = histories;

	const { table } = useDataTable<HistoryRow>({
		data: items,
		columns,
		pageCount: pagination.totalPages,
		getRowId: (row) => row.history.id,
	});

	return <DataTable table={table} key={JSON.stringify(pagination)} />;
}
