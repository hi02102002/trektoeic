import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import type { GrammarExercise } from "@trektoeic/schemas/grammar-course-file-schema";
import { useState } from "react";
import { AnswerExplanationCollapsible } from "@/components/answer-explanation-collapsible";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function GrammarExplanationText({ text }: { text: string }) {
	const t = text.trim();
	if (!t) return null;
	const looksLikeHtml = t.includes("<") && t.includes(">");
	if (looksLikeHtml) {
		return (
			<div
				className="prose prose-sm prose-neutral max-w-none whitespace-break-spaces text-sm leading-relaxed [&_li]:text-neutral-700 [&_p]:my-2 [&_p]:text-neutral-700 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_strong]:font-semibold [&_strong]:text-neutral-900 [&_ul]:my-2 [&_ul]:space-y-1"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: nội dung giải thích từ seed/CMS
				dangerouslySetInnerHTML={{ __html: t }}
			/>
		);
	}
	return (
		<p className="whitespace-pre-wrap text-neutral-700 text-sm leading-relaxed">
			{t}
		</p>
	);
}

function normalizeAnswer(s: string) {
	return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function answersMatch(user: string, expected: string) {
	const u = normalizeAnswer(user);
	const e = normalizeAnswer(expected);
	if (u === e) return true;
	return expected.split("/").some((seg) => normalizeAnswer(seg) === u);
}

function McqExerciseItem({
	exercise,
	index,
}: {
	exercise: Extract<GrammarExercise, { kind: "mcq4" | "mcq2" }>;
	index: number;
}) {
	const [picked, setPicked] = useState<number | null>(null);
	const showResult = picked !== null;
	const isCorrect = picked === exercise.correctIndex;
	const opts = exercise.options;

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="font-medium text-neutral-800 text-sm">
					Câu {index + 1}
				</CardTitle>
				<p className="text-neutral-700 text-sm leading-relaxed">
					{exercise.prompt}
				</p>
			</CardHeader>
			<CardContent className="space-y-3 pt-0">
				<div className="flex flex-col gap-2">
					{opts.map((opt, i) => {
						const selected = picked === i;
						const isAnswer = i === exercise.correctIndex;
						const wrongPick = showResult && selected && !isAnswer;

						return (
							<Button
								key={exercise.id + opt}
								type="button"
								variant="outline"
								disabled={showResult}
								onClick={() => setPicked(i)}
								className={cn(
									"h-auto min-h-10 justify-start whitespace-normal py-2 text-left font-normal text-sm",
									showResult &&
										isAnswer &&
										"border-emerald-300 bg-emerald-50 text-emerald-900",
									wrongPick && "border-red-300 bg-red-50 text-red-900",
								)}
							>
								<span className="mr-2 font-semibold text-neutral-400">
									{String.fromCharCode(65 + i)}.
								</span>
								{opt}
							</Button>
						);
					})}
				</div>
				{showResult && (
					<div className="space-y-3">
						<div
							className={cn(
								"flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm",
								isCorrect
									? "border-emerald-200 bg-emerald-50/90 text-emerald-950"
									: "border-red-200 bg-red-50/90 text-red-950",
							)}
						>
							{isCorrect ? (
								<CheckCircleIcon
									className="size-5 shrink-0 text-emerald-600"
									weight="fill"
								/>
							) : (
								<XCircleIcon
									className="size-5 shrink-0 text-red-600"
									weight="fill"
								/>
							)}
							<span className="font-medium">
								{isCorrect ? "Chính xác!" : "Chưa đúng."}
							</span>
						</div>
						{exercise.explanation.trim() ? (
							<AnswerExplanationCollapsible
								tone={isCorrect ? "correct" : "wrong"}
							>
								<GrammarExplanationText text={exercise.explanation} />
							</AnswerExplanationCollapsible>
						) : null}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function FillExerciseItem({
	exercise,
	index,
}: {
	exercise: Extract<GrammarExercise, { kind: "fill" }>;
	index: number;
}) {
	const [value, setValue] = useState("");
	const [checked, setChecked] = useState(false);
	const ok = answersMatch(value, exercise.answer);
	const showResult = checked;

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="font-medium text-neutral-800 text-sm">
					Câu {index + 1}
				</CardTitle>
				<p className="text-neutral-700 text-sm leading-relaxed">
					{exercise.prompt}
				</p>
				{exercise.hintKeyword ? (
					<p className="text-neutral-500 text-xs">
						Gợi ý: <span className="font-medium">{exercise.hintKeyword}</span>
					</p>
				) : null}
			</CardHeader>
			<CardContent className="space-y-3 pt-0">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<Input
						value={value}
						onChange={(e) => {
							setValue(e.target.value);
							setChecked(false);
						}}
						disabled={showResult && ok}
						placeholder="Nhập đáp án..."
						className="sm:max-w-xs"
					/>
					<Button
						type="button"
						variant="secondary"
						disabled={!value.trim() || (showResult && ok)}
						onClick={() => setChecked(true)}
					>
						Kiểm tra
					</Button>
				</div>
				{showResult && (
					<div className="space-y-3">
						<div
							className={cn(
								"flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm",
								ok
									? "border-emerald-200 bg-emerald-50/90 text-emerald-950"
									: "border-red-200 bg-red-50/90 text-red-950",
							)}
						>
							{ok ? (
								<CheckCircleIcon
									className="size-5 shrink-0 text-emerald-600"
									weight="fill"
								/>
							) : (
								<XCircleIcon
									className="size-5 shrink-0 text-red-600"
									weight="fill"
								/>
							)}
							<span className="font-medium">
								{ok ? "Chính xác!" : "Chưa đúng."}
							</span>
						</div>
						{!ok || exercise.explanation.trim() ? (
							<AnswerExplanationCollapsible tone={ok ? "correct" : "wrong"}>
								{!ok ? (
									<p className="mb-3 text-neutral-700 text-sm leading-relaxed">
										<span className="font-medium text-neutral-900">
											Đáp án đúng:{" "}
										</span>
										{exercise.answer}
									</p>
								) : null}
								<GrammarExplanationText text={exercise.explanation} />
							</AnswerExplanationCollapsible>
						) : null}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function ExerciseItem({
	exercise,
	index,
}: {
	exercise: GrammarExercise;
	index: number;
}) {
	switch (exercise.kind) {
		case "fill":
			return <FillExerciseItem exercise={exercise} index={index} />;
		case "mcq2":
		case "mcq4":
			return <McqExerciseItem exercise={exercise} index={index} />;
		default: {
			const _x: never = exercise;
			return _x;
		}
	}
}

export function GrammarExercises({
	exercises,
	exerciseTypeName,
	exerciseTypeDes,
}: {
	exercises: GrammarExercise[];
	exerciseTypeName?: string;
	exerciseTypeDes?: string;
}) {
	if (exercises.length === 0) return null;

	const hasMix = new Set(exercises.map((e) => e.kind)).size > 1;

	return (
		<div className="space-y-4">
			<div>
				<h2 className="font-semibold text-base text-neutral-900">Bài tập</h2>
				{exerciseTypeName ? (
					<p className="mt-0.5 font-medium text-neutral-700 text-sm">
						{exerciseTypeName}
					</p>
				) : null}
				{exerciseTypeDes ? (
					<p className="text-neutral-500 text-xs">{exerciseTypeDes}</p>
				) : (
					<p className="text-neutral-500 text-xs">
						{hasMix
							? "Nhiều dạng câu trong chủ đề này — chọn đáp án hoặc điền từ rồi kiểm tra."
							: "Chọn một đáp án — hệ thống sẽ hiển thị đúng/sai và giải thích ngay."}
					</p>
				)}
			</div>
			<div className="space-y-4">
				{exercises.map((ex, i) => (
					<ExerciseItem key={ex.id} exercise={ex} index={i} />
				))}
			</div>
		</div>
	);
}
