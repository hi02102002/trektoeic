import { getAllKits } from "./get-all-kits";
import { getAvailableKitYears } from "./get-available-kit-years";
import { getKitById } from "./get-kit-by-id";
import { getKitBySlug } from "./get-kit-by-slug";

export const kitsQueries = {
	getAllKits,
	getAvailableKitYears,
	getKitById,
	getKitBySlug,
};
