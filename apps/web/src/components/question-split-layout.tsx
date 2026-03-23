import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils";

type QuestionSplitLayoutProps = {
	enabled: boolean;
	resetKey: number;
	renderTop: () => ReactNode;
	renderBottom: () => ReactNode;
};

const LEFT_PANEL_SIZE = "48%";
const RIGHT_PANEL_SIZE = "52%";
const LEFT_PANEL_MIN_SIZE = "32%";
const RIGHT_PANEL_MIN_SIZE = "28%";
const CONTENT_HEIGHT_CLASS = "h-[calc(100svh_-_4rem)]";

export const QuestionSplitLayout = ({
	enabled,
	resetKey,
	renderTop,
	renderBottom,
}: QuestionSplitLayoutProps) => {
	const [viewportMode, setViewportMode] = useState<
		"unknown" | "mobile" | "desktop"
	>("unknown");
	const mobileTopRef = useRef<HTMLDivElement>(null);
	const desktopTopRef = useRef<HTMLDivElement>(null);
	const desktopBottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 1024px)");
		const syncViewportMode = () => {
			setViewportMode(mediaQuery.matches ? "desktop" : "mobile");
		};

		syncViewportMode();
		mediaQuery.addEventListener("change", syncViewportMode);

		return () => {
			mediaQuery.removeEventListener("change", syncViewportMode);
		};
	}, []);

	useEffect(() => {
		if (resetKey < 0) {
			return;
		}

		const scrollTargets = [
			mobileTopRef.current,
			desktopTopRef.current,
			desktopBottomRef.current,
		];

		scrollTargets.forEach((target) => {
			target?.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		});
	}, [resetKey]);

	if (!enabled) {
		return (
			<div
				className={cn(
					"mx-auto w-full max-w-3xl overflow-hidden",
					CONTENT_HEIGHT_CLASS,
				)}
			>
				<div className="h-full overflow-y-auto pb-20" ref={mobileTopRef}>
					<div className="space-y-3 p-4 pb-0">{renderTop()}</div>
					<div className="w-full space-y-8 p-4 pt-8">{renderBottom()}</div>
				</div>
			</div>
		);
	}

	return (
		<>
			{viewportMode !== "desktop" ? (
				<div
					className={cn(
						"mx-auto w-full max-w-3xl overflow-hidden",
						CONTENT_HEIGHT_CLASS,
						{
							"lg:hidden": viewportMode === "unknown",
						},
					)}
				>
					<div className="h-full overflow-y-auto pb-20" ref={mobileTopRef}>
						<div className="space-y-3 p-4 pb-0">{renderTop()}</div>
						<div className="w-full space-y-8 p-4 pt-8">{renderBottom()}</div>
					</div>
				</div>
			) : null}
			{viewportMode === "unknown" ? (
				<div
					className={cn(
						"hidden w-full overflow-hidden lg:flex",
						CONTENT_HEIGHT_CLASS,
					)}
				>
					<div
						className="h-full overflow-auto p-4"
						ref={desktopTopRef}
						style={{ width: LEFT_PANEL_SIZE }}
					>
						<div className="space-y-3">{renderTop()}</div>
					</div>
					<div className="flex w-3 items-center justify-center bg-transparent">
						<div className="h-16 w-1 rounded-full bg-border" />
					</div>
					<div
						className="h-full flex-1 overflow-auto border-input border-l p-4"
						ref={desktopBottomRef}
						style={{ width: RIGHT_PANEL_SIZE }}
					>
						<div className="space-y-8">{renderBottom()}</div>
					</div>
				</div>
			) : null}
			{viewportMode === "desktop" ? (
				<Group
					orientation="horizontal"
					className={cn("w-full overflow-hidden", CONTENT_HEIGHT_CLASS)}
				>
					<Panel
						defaultSize={LEFT_PANEL_SIZE}
						minSize={LEFT_PANEL_MIN_SIZE}
						id="question-content-panel"
					>
						<div className="h-full overflow-auto p-4" ref={desktopTopRef}>
							<div className="space-y-3">{renderTop()}</div>
						</div>
					</Panel>
					<Separator className="group flex w-3 items-center justify-center bg-transparent">
						<div
							className={cn(
								"h-16 w-1 rounded-full bg-border transition-colors",
								"group-data-[resize-handle-active]:bg-primary",
								"group-hover:bg-primary/60",
							)}
						/>
					</Separator>
					<Panel
						defaultSize={RIGHT_PANEL_SIZE}
						minSize={RIGHT_PANEL_MIN_SIZE}
						id="question-answer-panel"
					>
						<div
							className="h-full overflow-auto border-input border-l p-4"
							ref={desktopBottomRef}
						>
							<div className="space-y-8">{renderBottom()}</div>
						</div>
					</Panel>
				</Group>
			) : null}
		</>
	);
};
