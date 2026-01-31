import { getRouteApi } from "@tanstack/react-router";
import { FilterButtonGroup } from "@/components/filter-button-group";

const Route = getRouteApi("/_protected/app/_dashboard/mock-test/");

export const MockTestFilter = () => {
	const { year } = Route.useSearch();
	const { years } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	return (
		<FilterButtonGroup
			options={years}
			onValueChange={(val) => {
				navigate({
					search: (prev) => ({
						...prev,
						year: val === "all" ? "all" : Number(val),
					}),
				});
			}}
			value={`${year ?? "all"}`}
		/>
	);
};
