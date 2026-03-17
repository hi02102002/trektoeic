"use client";

import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import type { PartPracticeHistory } from "@trektoeic/schemas/part-practice-schema";
import { formatNumber } from "@trektoeic/utils/number";
import { buttonVariants } from "@/components/ui/button";
import { MAP_PART } from "@/constants";
import { cn } from "@/lib/utils";

export type HistoryRow = PartPracticeHistory;

export const columns: ColumnDef<HistoryRow>[] = [
	{
		id: "createdAt",
		accessorKey: "createdAt",
		header: "Ngày luyện tập",
		cell: ({ row }) => {
			const createdAt = new Date(row.original.createdAt);

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
		id: "part",
		accessorFn: (row) => String(row.metadata.part),
		header: "Part",
		enableSorting: false,
		cell: ({ row }) => {
			const part = row.original.metadata.part;
			const partInfo = MAP_PART[String(part) as keyof typeof MAP_PART];

			return (
				<div className="flex flex-col gap-0.5 text-xs">
					<div className="flex items-center gap-2">
						<span className="inline-flex items-center rounded bg-neutral-100 px-2 py-0.5 font-medium text-[11px] text-neutral-700">
							Part {part}
						</span>
						<span className="font-medium text-neutral-900">
							{partInfo?.title}
						</span>
					</div>
					{partInfo?.desc ? (
						<span className="text-neutral-400">{partInfo.desc}</span>
					) : null}
				</div>
			);
		},
	},
	{
		id: "result",
		accessorFn: (row) => row.metadata.numberOfCorrectQuestions ?? 0,
		header: "Kết quả",
		enableSorting: false,
		cell: ({ row }) => {
			const meta = row.original.metadata;
			const correct = meta.numberOfCorrectQuestions ?? 0;
			const wrong = meta.numberOfWrongQuestions ?? 0;
			const unanswered = meta.numberOfUnansweredQuestions ?? 0;

			return (
				<div className="flex flex-wrap gap-2 text-neutral-500 text-xs">
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
			);
		},
	},
	{
		id: "completed",
		accessorFn: (row) => {
			const meta = row.metadata;
			const correct = meta.numberOfCorrectQuestions ?? 0;
			const wrong = meta.numberOfWrongQuestions ?? 0;
			const total = meta.numberOfQuestions;

			return total > 0 ? Math.round(((correct + wrong) / total) * 100) : 0;
		},
		header: "Hoàn thành",
		cell: ({ row }) => {
			const meta = row.original.metadata;
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
			const history = row.original;
			const part = history.metadata.part;

			return (
				<Link
					to="/app/practices/$part/$sessionId/results"
					params={{
						part: String(part),
						sessionId: history.id,
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
