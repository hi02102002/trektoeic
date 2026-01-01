import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Part } from "@trektoeic/schemas/part-section-schema";
import z from "zod";
import { AppContent, AppHeader } from "@/components/layouts/app";
import { PartInstructions } from "@/components/part-instructions";
import { ProTips } from "@/components/pro-tips";
import { TsrBreadcrumbs } from "@/components/tsr-breadcrumbs";
import { MAP_PART } from "@/constants";
import { createOpenGraphData, generateMetadata } from "@/lib/meta";
import { orpc } from "@/utils/orpc";
import { ConfigSession } from "./_components/config-session";
import { CurrentProgress } from "./_components/current-progress";

export const Route = createFileRoute(
	"/_protected/app/_dashboard/practices/part-{$part}",
)({
	params: z.object({
		part: z.coerce.number().min(1).max(7),
	}),
	component: RouteComponent,
	async loader({ params, context }) {
		const { part } = params;

		const partSection = await context.queryClient.ensureQueryData(
			context.orpc.partSections.getPartSection.queryOptions({
				input: {
					part,
				},
			}),
		);

		return { partSection };
	},
	head: ({ loaderData, match }) => {
		if (!loaderData) {
			return { meta: [], links: [] };
		}

		const { partSection } = loaderData;
		const part = partSection.part;
		const partTitle = partSection.titleVi || `Phần ${part}`;
		const { desc } = MAP_PART[`${part}` as "1"];

		const { meta, links } = generateMetadata({
			title: `Luyện tập ${partTitle}`,
			description: `${desc} Luyện tập ${partTitle} TOEIC với các bài tập chất lượng cao, theo dõi tiến độ và nhận phản hồi chi tiết.`,
			keywords: [
				`TOEIC ${partTitle}`,
				`luyện tập ${partTitle}`,
				`bài tập ${partTitle} TOEIC`,
				`TOEIC part ${part}`,
			],
			...createOpenGraphData(
				`Luyện tập ${partTitle} | TrekToeic`,
				`${desc} Luyện tập ${partTitle} TOEIC với các bài tập chất lượng cao.`,
				match.pathname,
			),
			robots: {
				index: false,
				follow: false,
			},
			alternates: {
				canonical: match.pathname,
			},
		});

		return { meta, links };
	},
});

function RouteComponent() {
	const { part } = Route.useParams();
	const { data } = useSuspenseQuery(
		orpc.partSections.getPartSection.queryOptions({
			input: {
				part,
			},
		}),
	);

	const { desc } = MAP_PART[`${part}` as "1"];

	return (
		<AppContent
			header={
				<AppHeader
					title={data.titleVi || `Phần ${part}`}
					description={desc}
					className="max-w-4xl"
				/>
			}
			breadcrumbs={
				<TsrBreadcrumbs
					breadcrumbs={[
						{ label: "Trang chủ", to: "/app" },
						{ label: "Luyện tập", to: "/app/practices" },
						{
							label: data.titleVi || `Phần ${part}`,
							to: "/app/practices/part-{$part}",
							params: { part },
						},
					]}
				/>
			}
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 xl:flex-row">
				<div className="w-full max-w-3xl space-y-6">
					<PartInstructions
						introVi={data.introVi as string}
						intro={data.intro as string}
					/>
					<ProTips part={part as Part} />
				</div>
				<div className="grid w-full flex-1 shrink-0 grid-cols-1 flex-row gap-6 sm:grid-cols-2 xl:flex xl:w-auto xl:basis-80 xl:flex-col">
					<CurrentProgress />
					<ConfigSession />
				</div>
			</div>
		</AppContent>
	);
}
