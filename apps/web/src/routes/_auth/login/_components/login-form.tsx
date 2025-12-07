import { useTransition } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Form, SubmitButton, useZodForm } from "@/hooks/use-zod-form";
import { authClient } from "@/lib/auth-client";
import { getFieldId } from "@/utils/form";
import { getNameFromEmail } from "@/utils/get-name-from-email";

const LoginSchema = z.object({
	email: z
		.email({
			error: "Vui lòng nhập địa chỉ email hợp lệ.",
		})
		.min(1, "Vui lòng nhập địa chỉ email của bạn."),
});

type TLoginForm = z.infer<typeof LoginSchema>;

export const LoginForm = () => {
	const form = useZodForm({
		schema: LoginSchema,
	});
	const [isSubmitting, startSubmitting] = useTransition();

	const [isLoginWithGoogleLoading, startLoginWithGoogle] = useTransition();

	const handleSubmit = (values: TLoginForm) => {
		startSubmitting(async () => {
			const { data, error } = await authClient.signIn.magicLink({
				email: values.email,
				name: getNameFromEmail(values.email),
				callbackURL: "/app",
				newUserCallbackURL: "/app",
				errorCallbackURL: "/login",
			});

			if (data?.status) {
				toast.success(
					"Giử liên kết đăng nhập thành công! Vui lòng kiểm tra email của bạn.",
				);
			}

			if (error?.status === 429) {
				toast.error("Vui lòng chờ trước khi yêu cầu liên kết đăng nhập khác.");
			}
		});
	};

	const handleLoginWithGoogle = async () => {
		startLoginWithGoogle(async () => {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/app",
				newUserCallbackURL: "/app",
				errorCallbackURL: "/login",
			});
		});
	};

	return (
		<Form form={form} handleSubmit={handleSubmit} className="space-y-4">
			<FieldGroup>
				<Controller
					name="email"
					control={form.control}
					render={({ field, fieldState }) => {
						const id = getFieldId(form, "email");
						return (
							<Field
								data-invalid={fieldState.invalid}
								data-disabled={
									form.formState.isSubmitting || isLoginWithGoogleLoading
								}
							>
								<FieldLabel htmlFor={id} required>
									Email
								</FieldLabel>
								<Input
									{...field}
									id={id}
									aria-invalid={fieldState.invalid}
									placeholder="example@gmail.com"
									disabled={isSubmitting || isLoginWithGoogleLoading}
									autoComplete="off"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						);
					}}
				/>
			</FieldGroup>
			<SubmitButton
				className="w-full"
				disabled={
					!form.formState.isValid || !form.formState.isDirty || isSubmitting
				}
				loading={isSubmitting}
			>
				Đăng nhập
			</SubmitButton>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<Separator className="w-full" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						hoặc với
					</span>
				</div>
			</div>
			<Button
				variant="outline"
				className="inline-flex w-full items-center justify-center space-x-2"
				type="button"
				onClick={handleLoginWithGoogle}
				loading={isLoginWithGoogleLoading}
				disabled={isLoginWithGoogleLoading || isSubmitting}
			>
				<span className="font-medium text-sm">Đăng nhập với Google</span>
			</Button>
		</Form>
	);
};
