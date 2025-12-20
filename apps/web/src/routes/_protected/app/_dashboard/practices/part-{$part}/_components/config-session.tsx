import { useNavigate, useParams } from "@tanstack/react-router";
import { createId } from "@trektoeic/utils/create-id";
import { calculateEstimatedDurationMs } from "@trektoeic/utils/toeic-timing";
import { useEffect, useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const ConfigSessionSchema = z
	.object({
		mode: z.enum(["normal", "timed"]),
		numberOfQuestions: z.string().transform((val) => Number.parseInt(val, 10)),
		limitTime: z.number().optional(),
	})
	.refine(
		(data) => {
			if (data.mode === "timed") {
				return data.limitTime !== undefined && data.limitTime > 0;
			}
		},
		{
			error:
				"Thời gian làm bài phải lớn hơn 0 khi ở chế độ có giới hạn thời gian",
			path: ["limitTime"],
		},
	);

type TConfigSessionForm = z.infer<typeof ConfigSessionSchema>;

export const ConfigSession = () => {
	const { part } = useParams({
		from: "/_protected/app/_dashboard/practices/part-{$part}",
	});
	const navigate = useNavigate();
	const form = useForm<TConfigSessionForm>({
		defaultValues: {
			mode: "normal",
			numberOfQuestions: 10,
		},
	});

	const [isPending, startTransition] = useTransition();

	const handleStartSession = form.handleSubmit(async (data) => {
		startTransition(async () => {
			await navigate({
				to: "/app/practices/$part/$session-id",
				params: {
					part: `${part}`,
					"session-id": createId(),
				},
				search: {
					mode: data.mode,
					duration: data.limitTime,
					numberOfQuestions: data.numberOfQuestions,
				},
			});
		});
	});

	const mode = form.watch("mode");
	const numberOfQuestions = form.watch("numberOfQuestions");

	const timeNeedToFinish = useMemo(
		() =>
			mode === "timed"
				? calculateEstimatedDurationMs({
						part,
						questionCount: numberOfQuestions,
					})
				: undefined,
		[mode, numberOfQuestions, part],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <no>
	useEffect(() => {
		form.setValue("limitTime", timeNeedToFinish);
	}, [timeNeedToFinish]);

	return (
		<div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
			<div className="border-neutral-100 border-b bg-neutral-50/50 px-4 py-3">
				<h3 className="font-semibold text-neutral-900 text-xs">
					Tùy chỉnh phiên làm bài
				</h3>
			</div>
			<div className="p-4">
				<form onSubmit={handleStartSession}>
					<FieldGroup>
						<Controller
							name="mode"
							control={form.control}
							render={({ field, fieldState }) => {
								return (
									<Field>
										<FieldLabel>Chế độ làm bài</FieldLabel>
										<Select
											name={field.name}
											value={field.value}
											defaultValue={field.value || "normal"}
											onValueChange={field.onChange}
										>
											<SelectTrigger
												id={field.name}
												aria-invalid={fieldState.invalid}
											>
												<SelectValue placeholder="Chọn" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="normal">Luyện tập</SelectItem>
												<SelectItem value="timed">Kiểm tra</SelectItem>
											</SelectContent>
										</Select>
									</Field>
								);
							}}
						/>
						<Controller
							name="numberOfQuestions"
							control={form.control}
							render={({ field, fieldState }) => {
								return (
									<Field>
										<FieldLabel>Số câu hỏi</FieldLabel>
										<Select
											name={field.name}
											defaultValue={field.value?.toString() || "10"}
											value={field.value?.toString()}
											onValueChange={field.onChange}
										>
											<SelectTrigger
												id={field.name}
												aria-invalid={fieldState.invalid}
											>
												<SelectValue placeholder="Chọn" />
											</SelectTrigger>
											<SelectContent>
												{["10", "15", "20", "25", "30"].map((num) => (
													<SelectItem key={num} value={num}>
														{num} câu
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								);
							}}
						/>
						{timeNeedToFinish !== undefined && (
							<p className="font-medium text-neutral-600 text-xs">
								Thời gian cần thiết để hoàn thành:{" "}
								<span className="font-semibold text-neutral-900">
									{Math.ceil(timeNeedToFinish / 60 / 1000)} phút
								</span>
							</p>
						)}
						<Button
							type="submit"
							loading={isPending}
							loadingText={"Chờ chút nhé..."}
						>
							Bắt đầu làm bài
						</Button>
					</FieldGroup>
				</form>
			</div>
		</div>
	);
};
