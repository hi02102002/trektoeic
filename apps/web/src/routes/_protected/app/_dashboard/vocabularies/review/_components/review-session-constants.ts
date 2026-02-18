export const GRADES = [
	{
		key: "again",
		label: "Again",
		timeFallback: "< 1m",
		className:
			"border-red-200/70 hover:border-red-300 hover:bg-red-50/70 hover:text-red-700",
	},
	{
		key: "hard",
		label: "Hard",
		timeFallback: "2d",
		className:
			"border-orange-200/70 hover:border-orange-300 hover:bg-orange-50/70 hover:text-orange-700",
	},
	{
		key: "good",
		label: "Good",
		timeFallback: "5d",
		className:
			"border-emerald-200/70 hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-emerald-700",
	},
	{
		key: "easy",
		label: "Easy",
		timeFallback: "8d",
		className:
			"border-sky-200/70 hover:border-sky-300 hover:bg-sky-50/70 hover:text-sky-700",
	},
] as const;

export const HOTKEY_HINTS = [
	{ key: "Space", action: "Show answer" },
	{ key: "P", action: "Play audio" },
	{ key: "1-4", action: "Quick choose" },
] as const;

export type GradeOption = (typeof GRADES)[number];
export type HotkeyHint = (typeof HOTKEY_HINTS)[number];
