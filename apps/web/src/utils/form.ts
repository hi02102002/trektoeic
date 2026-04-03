export const getFieldId = <TFieldName extends string>(
	form: { id: string },
	fieldName: TFieldName,
) => {
	return `${form.id}-${fieldName}`;
};
