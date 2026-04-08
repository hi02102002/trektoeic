"use client";

import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import type { MockTestHistoryListItem } from "@trektoeic/schemas/mock-test-schema";
import { formatNumber } from "@trektoeic/utils/number";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HistoryRow = MockTestHistoryListItem;

export const columns: ColumnDef<HistoryRow>[] = [
	{
		id: "createdAt",
		accessorFn: (row) => row.history.createdAt,
		header: "Ngày làm bài",
		cell: ({ row }) => {
			const createdAt = new Date(row.original.history.createdAt);

			return (
				<span className="text-neutral-500 text-xs">
					{createdAt.toLocaleString("vi-VN", {
						dateStyle: "short",
						timeStyle: "short",
					})}
				</span>
			);
		},
	},
	{
		id: "mockTest",
		accessorFn: (row) => row.kit?.name ?? row.history.metadata.title,
		header: "Đề thi",
		enableSorting: false,
		cell: ({ row }) => {
			const { history, kit } = row.original;

			return (
				<div className="flex flex-col gap-0.5 text-xs">
					<div className="flex items-center gap-2">
						<span className="inline-flex items-center rounded bg-neutral-100 px-2 py-0.5 font-medium text-[11px] text-neutral-700">
							ETS {history.metadata.year}
						</span>
						<span className="font-medium text-neutral-900">
							{kit?.name ?? history.metadata.title}
						</span>
					</div>
					<span className="text-neutral-400">
						200 câu hỏi • 120 phút • Full test
					</span>
				</div>
			);
		},
	},
	{
		id: "result",
		accessorFn: (row) => row.history.metadata.totalScore ?? 0,
		header: "Kết quả",
		enableSorting: false,
		cell: ({ row }) => {
			const meta = row.original.history.metadata;
			const totalScore = meta.totalScore ?? 0;
			const listeningScore = meta.listeningScore ?? 0;
			const readingScore = meta.readingScore ?? 0;
			const correct = meta.numberOfCorrectQuestions ?? 0;
			const wrong = meta.numberOfWrongQuestions ?? 0;
			const unanswered = meta.numberOfUnansweredQuestions ?? 0;

			return (
				<div className="flex flex-col gap-1 text-xs">
					<div className="flex flex-wrap items-center gap-2 text-neutral-500">
						<span className="font-semibold text-neutral-900">
							{formatNumber(totalScore)} điểm
						</span>
						<span>Nghe {formatNumber(listeningScore)}</span>
						<span>Đọc {formatNumber(readingScore)}</span>
					</div>
					<div className="flex flex-wrap gap-2 text-neutral-500">
						<span>
							<span className="font-semibold text-emerald-600">
								{formatNumber(correct)}
							</span>{" "}
							đúng
						</span>
						<span>
							<span className="font-semibold text-red-600">
								{formatNumber(wrong)}
							</span>{" "}
							sai
						</span>
						<span>
							<span className="font-semibold text-neutral-900">
								{formatNumber(unanswered)}
							</span>{" "}
							bỏ qua
						</span>
					</div>
				</div>
			);
		},
	},
	{
		id: "completed",
		accessorFn: (row) => {
			const meta = row.history.metadata;
			const correct = meta.numberOfCorrectQuestions ?? 0;
			const wrong = meta.numberOfWrongQuestions ?? 0;
			const total = meta.numberOfQuestions;

			return total > 0 ? Math.round(((correct + wrong) / total) * 100) : 0;
		},
		header: "Hoàn thành",
		cell: ({ row }) => {
			const meta = row.original.history.metadata;
			const correct = meta.numberOfCorrectQuestions ?? 0;
			const wrong = meta.numberOfWrongQuestions ?? 0;
			const total = meta.numberOfQuestions;
			const completedPct =
				total > 0 ? Math.round(((correct + wrong) / total) * 100) : 0;

			return (
				<span className="font-semibold text-neutral-900 text-xs">
					{completedPct}%
				</span>
			);
		},
	},
	{
		id: "actions",
		header: "Hành động",
		cell: ({ row }) => {
			const { history, kit } = row.original;

			if (!kit?.slug) {
				return <span className="text-neutral-400 text-xs">Không khả dụng</span>;
			}

			return (
				<Link
					to="/app/mock-test/$slug/$historyId"
					params={{
						slug: kit.slug,
						historyId: history.id,
					}}
					className={cn(
						buttonVariants({
							variant: "ghost",
							size: "sm",
						}),
						"text-xs",
					)}
				>
					Chi tiết
				</Link>
			);
		},
	},
];
