import { useTranslation } from '@/hooks/useTranslation.ts';

interface SeatingLegendProps {
	showMySeats: boolean;
}

export function SeatingLegend({showMySeats}: SeatingLegendProps) {
	const { t } = useTranslation();

	return (
		<div className="mt-6 flex w-full flex-wrap items-center justify-center gap-4 border-t border-zinc-200 pt-4 lg:mt-auto lg:gap-6"
			aria-label={`${t('seat')} – ${t('available')} / ${t('unavailable')}`}
		>
			<div className="flex items-center gap-2">
				<span className="size-4 rounded-full border border-violet-200 bg-violet-50" aria-hidden="true"/>
				<span className="text-xs text-zinc-600 sm:text-sm">
					{t('available')}
				</span>
			</div>

			<div className="flex items-center gap-2">
				<span className="size-4 rounded-full bg-zinc-200 opacity-60" aria-hidden="true"/>
				<span className="text-xs text-zinc-600 sm:text-sm">
					{t('unavailable')}
				</span>
			</div>

			{showMySeats && (
				<div className="flex items-center gap-2">
					<span className="size-4 rounded-full border border-violet-500 bg-violet-400" aria-hidden="true"/>
					<span className="text-xs text-zinc-600 sm:text-sm">
						{t('mySeat')}
					</span>
				</div>
			)}
		</div>
	);
}