import { getAllCategories } from "./get-all-categories";
import { getCategoryById } from "./get-category-by-id";
import { getCategoryBySlug } from "./get-category-by-slug";
import { getVocabulariesByCategoryId } from "./get-vocabularies-by-category-id";

export const vocabulariesQueries = {
	getAllCategories,
	getCategoryById,
	getCategoryBySlug,
	getVocabulariesByCategoryId,
};
