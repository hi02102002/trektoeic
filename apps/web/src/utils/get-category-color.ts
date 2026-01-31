/**
 * Available Tailwind colors for categories
 */
const TAILWIND_COLORS = [
	"blue",
	"green",
	"red",
	"yellow",
	"slate",
	"purple",
	"pink",
	"indigo",
	"violet",
	"fuchsia",
	"rose",
	"orange",
	"amber",
	"lime",
	"emerald",
	"teal",
	"cyan",
	"sky",
] as const;

export type CategoryColor = (typeof TAILWIND_COLORS)[number];

/**
 * Tailwind class mappings for category colors
 * These need to be explicitly defined so Tailwind can detect them at build time
 */
export const CATEGORY_COLOR_CLASSES: Record<
	CategoryColor,
	{
		badgeBg: string;
		badgeText: string;
		progressBar: string;
	}
> = {
	blue: {
		badgeBg: "bg-blue-50",
		badgeText: "text-blue-700",
		progressBar: "bg-blue-500",
	},
	green: {
		badgeBg: "bg-green-50",
		badgeText: "text-green-700",
		progressBar: "bg-green-500",
	},
	red: {
		badgeBg: "bg-red-50",
		badgeText: "text-red-700",
		progressBar: "bg-red-500",
	},
	yellow: {
		badgeBg: "bg-yellow-50",
		badgeText: "text-yellow-700",
		progressBar: "bg-yellow-500",
	},
	slate: {
		badgeBg: "bg-slate-50",
		badgeText: "text-slate-700",
		progressBar: "bg-slate-500",
	},
	purple: {
		badgeBg: "bg-purple-50",
		badgeText: "text-purple-700",
		progressBar: "bg-purple-500",
	},
	pink: {
		badgeBg: "bg-pink-50",
		badgeText: "text-pink-700",
		progressBar: "bg-pink-500",
	},
	indigo: {
		badgeBg: "bg-indigo-50",
		badgeText: "text-indigo-700",
		progressBar: "bg-indigo-500",
	},
	violet: {
		badgeBg: "bg-violet-50",
		badgeText: "text-violet-700",
		progressBar: "bg-violet-500",
	},
	fuchsia: {
		badgeBg: "bg-fuchsia-50",
		badgeText: "text-fuchsia-700",
		progressBar: "bg-fuchsia-500",
	},
	rose: {
		badgeBg: "bg-rose-50",
		badgeText: "text-rose-700",
		progressBar: "bg-rose-500",
	},
	orange: {
		badgeBg: "bg-orange-50",
		badgeText: "text-orange-700",
		progressBar: "bg-orange-500",
	},
	amber: {
		badgeBg: "bg-amber-50",
		badgeText: "text-amber-700",
		progressBar: "bg-amber-500",
	},
	lime: {
		badgeBg: "bg-lime-50",
		badgeText: "text-lime-700",
		progressBar: "bg-lime-500",
	},
	emerald: {
		badgeBg: "bg-emerald-50",
		badgeText: "text-emerald-700",
		progressBar: "bg-emerald-500",
	},
	teal: {
		badgeBg: "bg-teal-50",
		badgeText: "text-teal-700",
		progressBar: "bg-teal-500",
	},
	cyan: {
		badgeBg: "bg-cyan-50",
		badgeText: "text-cyan-700",
		progressBar: "bg-cyan-500",
	},
	sky: {
		badgeBg: "bg-sky-50",
		badgeText: "text-sky-700",
		progressBar: "bg-sky-500",
	},
};

/**
 * Generates a deterministic color for a category based on its ID
 * This ensures the same category always gets the same color
 */
export function getCategoryColor(categoryId: string): CategoryColor {
	// Simple hash function to convert string ID to number
	let hash = 0;
	for (let i = 0; i < categoryId.length; i++) {
		const char = categoryId.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}

	// Use absolute value and modulo to get index
	const index = Math.abs(hash) % TAILWIND_COLORS.length;
	return TAILWIND_COLORS[index];
}
