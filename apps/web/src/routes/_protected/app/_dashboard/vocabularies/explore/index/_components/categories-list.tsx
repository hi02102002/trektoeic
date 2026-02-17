import { getRouteApi } from "@tanstack/react-router";
import { CategoryItem } from "./categories-item";

const Route = getRouteApi("/_protected/app/_dashboard/vocabularies/explore/");

export const CategoriesList = () => {
	const { categories } = Route.useLoaderData();
	return (
		<div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{categories.map((category) => {
				return <CategoryItem key={category.id} category={category} />;
			})}
		</div>
	);
};
