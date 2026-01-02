export function getTime({
	hours = 0,
	minutes = 0,
	seconds = 0,
}: {
	hours?: number;
	minutes?: number;
	seconds?: number;
}) {
	return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
}
