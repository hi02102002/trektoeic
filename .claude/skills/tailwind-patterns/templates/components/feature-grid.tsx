/**
 * Feature Grid Component
 *
 * Responsive 3-column feature grid with icons.
 * Automatically collapses to 1 column on mobile, 2 on tablet.
 *
 * Usage:
 *   <FeatureGrid features={features} />
 */

interface Feature {
	title: string;
	description: string;
	icon: React.ReactNode;
}

interface FeatureGridProps {
	features: Feature[];
}

export function FeatureGrid({ features }: FeatureGridProps) {
	return (
		<section className="py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="mx-auto mb-12 max-w-2xl text-center">
					<h2 className="mb-4 font-bold text-3xl sm:text-4xl">
						Everything You Need
					</h2>
					<p className="text-lg text-muted-foreground">
						Production-ready patterns for common UI components and layouts.
					</p>
				</div>

				{/* Feature Grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => (
						<div
							key={index}
							className="rounded-lg border border-border bg-card p-6 text-card-foreground transition-shadow hover:shadow-lg"
						>
							{/* Icon */}
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
								{feature.icon}
							</div>

							{/* Content */}
							<h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
							<p className="text-muted-foreground text-sm">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/**
 * Example Usage:
 *
 * const features = [
 *   {
 *     title: 'Responsive Design',
 *     description: 'Mobile-first patterns that work on all devices.',
 *     icon: <svg className="h-6 w-6">📱</svg>
 *   },
 *   {
 *     title: 'Dark Mode',
 *     description: 'Automatic dark mode support with semantic tokens.',
 *     icon: <svg className="h-6 w-6">🌙</svg>
 *   },
 *   {
 *     title: 'Production Ready',
 *     description: 'Battle-tested patterns used in real applications.',
 *     icon: <svg className="h-6 w-6">✓</svg>
 *   },
 * ]
 *
 * <FeatureGrid features={features} />
 */

/**
 * Alternative: Feature Grid with Numbers
 */

export function NumberedFeatureGrid({ features }: FeatureGridProps) {
	return (
		<section className="py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => (
						<div
							key={index}
							className="rounded-lg border border-border bg-card p-6 text-card-foreground"
						>
							{/* Number Badge */}
							<div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-sm">
								{index + 1}
							</div>

							<h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
							<p className="text-muted-foreground text-sm">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/**
 * Alternative: Feature List (Horizontal Layout)
 */

export function FeatureList({ features }: FeatureGridProps) {
	return (
		<section className="py-16 sm:py-24">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				<div className="space-y-8">
					{features.map((feature, index) => (
						<div key={index} className="flex items-start gap-6">
							{/* Icon */}
							<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
								{feature.icon}
							</div>

							{/* Content */}
							<div>
								<h3 className="mb-2 font-semibold text-xl">{feature.title}</h3>
								<p className="text-muted-foreground">{feature.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
