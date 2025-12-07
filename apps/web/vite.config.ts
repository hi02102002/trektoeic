import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		tailwindcss(),
		tanstackStart({
			router: {
				routeFileIgnorePattern: "^_(components|styles|assets|utils)$",
			},
		}),
		nitro({
			preset: "node-server",
		}),
		viteReact(),
	],
	build: {
		rollupOptions: {
			external: ["pg", "pg-native"],
		},
	},
});
