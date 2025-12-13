import { EarIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { IconBadge } from "@/components/icon-badge";
import { useTotalQuestionsEachPart } from "@/hooks/queries/use-total-questions-each-part";
import { PartSectionCard } from "./part-section-card";
import { SectionWithTitle } from "./section-with-title";

const PARTS = ["1", "2", "3", "4"] as const;

export const ListeningSection = () => {
	const { data: totalQuestionsEachPart } = useTotalQuestionsEachPart();

	return (
		<SectionWithTitle
			title="Phần Nghe"
			subtitle="4 Parts"
			iconBadge={
				<IconBadge color="indigo">
					<EarIcon size={20} weight="duotone" />
				</IconBadge>
			}
		>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{PARTS.map((part) => (
					<Link
						key={part}
						to="/app/practices/part-{$part}"
						params={{
							part,
						}}
						className="block"
					>
						<PartSectionCard
							part={part}
							totalQuestions={totalQuestionsEachPart?.[part] ?? undefined}
						/>
					</Link>
				))}
			</div>
		</SectionWithTitle>
	);
};
