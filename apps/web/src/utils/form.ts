import type { AnyZodForm } from "@/hooks/use-zod-form";

export const getFieldId = (form: AnyZodForm, fieldName: string) => {
	return `${form.id}-${fieldName}`;
};
