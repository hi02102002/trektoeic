export const cleanNullVal = <T>(obj: T): Partial<T> => {
	const cleanedObj: Partial<T> = { ...obj };
	Object.keys(cleanedObj).forEach((key) => {
		if (cleanedObj[key as keyof T] === null) {
			delete cleanedObj[key as keyof T];
		}
	});
	return cleanedObj;
};
