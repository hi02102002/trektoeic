import { zodResolver } from "@hookform/resolvers/zod";
import { Slot } from "@radix-ui/react-slot";
import { useId, useMemo } from "react";
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

type SchemaInput<TSchema extends z.ZodType> = Extract<
	TSchema["_input"],
	FieldValues
>;

export function useZodForm<TSchema extends z.ZodType>(
		props: Omit<UseFormProps<SchemaInput<TSchema>>, "resolver"> & {
			schema: TSchema;
			id?: string;
		},
	) {
		const id = useId();
		const form = useForm<SchemaInput<TSchema>>({
			...props,
			// @ts-expect-error
			resolver: zodResolver(props.schema, undefined, {
				// This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
				raw: true,
			}),
		}) as UseFormReturn<SchemaInput<TSchema>>;

		return useMemo(
			() =>
				({
					...form,
					id: `form-${id}${props.id ? `-${props.id}` : ""}`,
				}) as UseZodForm<SchemaInput<TSchema>>,
			[form, id, props.id],
		);
	}

export type AnyZodForm = Pick<UseZodForm<FieldValues>, "id" | "formState">;

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
