import { zodResolver } from "@hookform/resolvers/zod";
import { Slot } from "@radix-ui/react-slot";
import { useId } from "react";
import {
	type FieldValues,
	FormProvider,
	type SubmitHandler,
	type UseFormProps,
	type UseFormReturn,
	useForm,
	useFormContext,
} from "react-hook-form";
import type { z } from "zod";
import { Button, type ButtonProps } from "@/components/ui/button";

type UseZodForm<TInput extends FieldValues> = UseFormReturn<TInput> & {
	/**
	 * A unique ID for this form.
	 */
	id: string;
};
export function useZodForm<TSchema extends z.ZodType>(
	// @ts-expect-error
	props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
		schema: TSchema;
		id?: string;
	},
) {
	// @ts-expect-error
	const form = useForm<TSchema["_input"]>({
		...props,
		// @ts-expect-error
		resolver: zodResolver(props.schema, undefined, {
			// This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
			raw: true,
		}),
		// @ts-expect-error
	}) as UseZodForm<TSchema["_input"]>;

	form.id = `form-${useId()}${props.id ? `-${props.id}` : ""}`;

	return form;
}

// biome-ignore lint/suspicious/noExplicitAny: <it is needed>
export type AnyZodForm = UseZodForm<any>;

export function Form<TInput extends FieldValues>(
	props: Omit<React.ComponentProps<"form">, "onSubmit" | "id"> & {
		handleSubmit: SubmitHandler<TInput>;
		form: UseZodForm<TInput>;
	},
) {
	const { handleSubmit, form, ...passThrough }: typeof props = props;
	return (
		<FormProvider {...form}>
			<form
				{...passThrough}
				id={form.id}
				onSubmit={(event) => {
					form.handleSubmit(async (values) => {
						try {
							await handleSubmit(values);
						} catch (cause) {
							form.setError("root.server", {
								message: (cause as Error)?.message ?? "Unknown error",
								type: "server",
							});
						}
					})(event);
				}}
			/>
		</FormProvider>
	);
}

export function SubmitButton(
	props: Omit<ButtonProps, "type" | "form" | "children"> & {
		/**
		 * Optionally specify a form to submit instead of the closest form context.
		 */
		form?: AnyZodForm;
		children:
			| React.ReactNode
			| ((props: { isLoading: boolean }) => React.ReactNode);
		asChild?: boolean;
	},
) {
	const context = useFormContext();

	const form = props.form ?? context;
	if (!form) {
		throw new Error(
			"SubmitButton must be used within a Form or have a form prop",
		);
	}
	const { formState } = form;

	const Comp = props.asChild ? Slot : Button;

	return (
		<Comp
			{...props}
			form={props.form?.id}
			type="submit"
			disabled={formState.isSubmitting || props.disabled}
			loading={formState.isSubmitting || props.loading}
		>
			{typeof props.children === "function"
				? props.children({
						isLoading: formState.isSubmitting || props.loading || false,
					})
				: props.children}
		</Comp>
	);
}
