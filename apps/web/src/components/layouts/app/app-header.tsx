export const AppHeader = ({
	title,
	description,
	right,
}: {
	title: string;
	description?: string;
	right?: React.ReactNode;
}) => {
	return (
		<div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
			<div className="max-w-xl">
				<h1 className="font-medium text-2xl text-slate-900 tracking-tight sm:text-3xl">
					{title}
				</h1>
				<p className="mt-3 text-slate-600 text-sm leading-relaxed">
					{description}
				</p>
				{right}
			</div>
		</div>
	);
};
