export const formatNumber = (
	value: string | number,
	options?: Intl.NumberFormatOptions,
) => {
	const number = typeof value === "string" ? Number.parseFloat(value) : value;

	if (Number.isNaN(number)) {
		return value;
	}

	return new Intl.NumberFormat("en-US", options).format(number);
};
