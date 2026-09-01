import { useTranslation } from '@/hooks/useTranslation.ts';

export function SeatingStage() {
	const { t } = useTranslation();

	return (
		<div className="mb-8 flex w-full justify-center">
			<div className="w-2/3 max-w-xl">
				<div className="h-3 rounded-t-md bg-violet-50 shadow-lg" />
				<p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
					{t('stage')}
				</p>
			</div>
		</div>
	);
}