import {
	createRouter as createTanStackRouter,
	ErrorComponent,
} from "@tanstack/react-router";
import "./index.css";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { toast } from "sonner";
import { orpc } from "./lib/orpc/orpc";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
	const queryClient = new QueryClient({
		queryCache: new QueryCache({
			onError: (error) => {
				toast.error(`Error: ${error.message}`, {
					action: {
						label: "retry",
						onClick: () => {
							queryClient.invalidateQueries();
						},
					},
				});
			},
		}),
	});
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: {
			orpc,
			queryClient,
			user: null,
		},
		defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
		defaultPreload: "viewport",
	});

	const routerWithquery = routerWithQueryClient(router, queryClient);

	return routerWithquery;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
