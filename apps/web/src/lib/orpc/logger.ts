//https://github.com/trpc/trpc/blob/main/packages/client/src/links/loggerLink.ts

import type { ClientContext } from "@orpc/client";
import type { RPCLinkOptions } from "@orpc/client/fetch";
import type { OperationType } from "@orpc/tanstack-query";
import { getOperationContext } from "./get-operation-ctx";

type ConsoleEsque = {
	log: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
};

type ColorMode = "ansi" | "css" | "none";

type Direction = "up" | "down";

interface LoggerOptions<C extends ClientContext = ClientContext> {
	/**
	 * Enable or disable the logger based on the operation context
	 * @default () => process.env.NODE_ENV === 'development'
	 */
	enabled?: (opts: {
		path: readonly string[];
		input: unknown;
		context: C;
		direction: Direction;
		result?: unknown;
		error?: unknown;
	}) => boolean;
	/**
	 * Custom console implementation
	 * @default console
	 */
	console?: ConsoleEsque;
	/**
	 * Color mode for the logger output
	 * @default typeof window === 'undefined' ? 'ansi' : 'css'
	 */
	colorMode?: ColorMode;
}

const palettes = {
	css: {
		query: ["72e3ff", "3fb0d8"], // cyan
		mutation: ["c5a3fc", "904dfc"], // purple
		subscription: ["ff49e1", "d83fbe"], // pink
		infinite: ["34d399", "10b981"], // emerald
		streamed: ["34d399", "10b981"], // emerald
		live: ["34d399", "10b981"], // emerald
	},
	ansi: {
		regular: {
			query: ["\x1b[30;46m", "\x1b[97;46m"], // cyan background
			mutation: ["\x1b[30;45m", "\x1b[97;45m"], // magenta background
			subscription: ["\x1b[30;42m", "\x1b[97;42m"], // green background
			infinite: ["\x1b[30;42m", "\x1b[97;42m"], // emerald background
			streamed: ["\x1b[30;42m", "\x1b[97;42m"], // emerald background
			live: ["34d399", "10b981"], // emerald
		},
		bold: {
			query: ["\x1b[1;30;46m", "\x1b[1;97;46m"],
			mutation: ["\x1b[1;30;45m", "\x1b[1;97;45m"],
			subscription: ["\x1b[1;30;42m", "\x1b[1;97;42m"],
			infinite: ["\x1b[1;30;42m", "\x1b[1;97;42m"],
			streamed: ["\x1b[1;30;42m", "\x1b[1;97;42m"],
			live: ["34d399", "10b981"], // emerald
		},
	},
} as const;

function constructPartsAndArgs(opts: {
	direction: Direction;
	type: OperationType;
	path: readonly string[];
	id: number;
	input: unknown;
	colorMode: ColorMode;
	result?: unknown;
	error?: unknown;
	elapsedMs?: number;
}) {
	const {
		direction,
		type,
		path,
		id,
		input,
		colorMode,
		result,
		error,
		elapsedMs,
	} = opts;
	const pathStr = path.join(".");
	const parts: string[] = [];
	const args: unknown[] = [];

	if (colorMode === "none") {
		parts.push(
			direction === "up" ? ">>" : "<<",
			"orpc",
			type,
			`#${id}`,
			pathStr,
		);
	} else if (colorMode === "ansi") {
		const [lightRegular, darkRegular] = palettes.ansi.regular[type];
		const [lightBold, darkBold] = palettes.ansi.bold[type];
		const reset = "\x1b[0m";

		parts.push(
			direction === "up" ? lightRegular : darkRegular,
			direction === "up" ? ">>" : "<<",
			"orpc",
			type,
			direction === "up" ? lightBold : darkBold,
			`#${id}`,
			pathStr,
			reset,
		);
	} else {
		const [light, dark] = palettes.css[type];
		const css = `
      background-color: #${direction === "up" ? light : dark};
      color: ${direction === "up" ? "black" : "white"};
      padding: 2px;
    `;

		parts.push(
			"%c",
			direction === "up" ? ">>" : "<<",
			"orpc",
			type,
			`#${id}`,
			`%c${pathStr}%c`,
			"%O",
		);
		args.push(
			css,
			`${css}; font-weight: bold;`,
			`${css}; font-weight: normal;`,
		);
	}

	if (direction === "up") {
		args.push({ input });
	} else {
		args.push({
			input,
			result,
			error,
			elapsedMs,
		});
	}

	return { parts, args };
}

let requestId = 0;

export const logger = <C extends ClientContext = ClientContext>(
	options: LoggerOptions<C> = {},
): NonNullable<RPCLinkOptions<C>["interceptors"]>[number] => {
	const {
		enabled = () => process.env.NODE_ENV === "development",
		console: c = console,
		colorMode = typeof window === "undefined" ? "ansi" : "css",
	} = options;

	return async ({ path, input, context, next, lastEventId, signal }) => {
		const id = ++requestId;
		const startTime = Date.now();
		const operationContext = getOperationContext(context);
		const type: OperationType = operationContext?.type ?? "query";

		if (
			enabled({
				path,
				input,
				context,
				direction: "up",
			})
		) {
			const { parts, args } = constructPartsAndArgs({
				direction: "up",
				type,
				path,
				id,
				input,
				colorMode,
			});
			c.log(parts.join(" "), ...args);
		}

		try {
			const result = await next({
				path,
				input,
				context,
				lastEventId,
				signal,
			});

			const elapsedMs = Date.now() - startTime;

			if (
				enabled({
					path,
					input,
					context,
					direction: "down",
					result,
				})
			) {
				const { parts, args } = constructPartsAndArgs({
					direction: "down",
					type,
					path,
					id,
					input,
					colorMode,
					result,
					elapsedMs,
				});
				c.log(parts.join(" "), ...args);
			}

			return result;
		} catch (error) {
			const elapsedMs = Date.now() - startTime;

			if (
				enabled({
					path,
					input,
					context,
					direction: "down",
					error,
				})
			) {
				const { parts, args } = constructPartsAndArgs({
					direction: "down",
					type,
					path,
					id,
					input,
					colorMode,
					error,
					elapsedMs,
				});
				c.error(parts.join(" "), ...args);
			}

			throw error;
		}
	};
};
