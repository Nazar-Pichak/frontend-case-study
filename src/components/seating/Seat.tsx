import { useState, forwardRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation.ts';

import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn, formatCurrency } from '@/lib/utils.ts';

import type { Seats, TicketTypes } from '@/lib/types.ts';

interface SeatProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	seatData: Seats;
	ticketType: TicketTypes | undefined;
	isSelected: boolean;
	currencyIso: string;
	onToggle: (seat: Seats) => void;
}

export const Seat = forwardRef<HTMLButtonElement, SeatProps>(
	(
		{
			seatData,
			ticketType,
			isSelected,
			currencyIso,
			onToggle,
			className,
			...buttonProps
		},
		ref
	) => {

		const { language, t } = useTranslation();
		const [isOpen, setIsOpen] = useState(false);
		const handleToggle = () => { onToggle(seatData); setIsOpen(false)};

		return (
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<button {...buttonProps} ref={ref} type="button"
						className={cn('flex size-8 items-center justify-center rounded-full border text-xs font-medium transition-colors',
							isSelected
								? 'border-violet-700 bg-violet-700 text-white ring-2 ring-violet-200'
								: 'border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-600 hover:bg-violet-600 hover:text-white',
							className
						)}
						aria-label={`${t('seat')} ${seatData.place}, ${isSelected ? t('seatSelected') : t('seatAvailable')}`}
						aria-pressed={isSelected}
					>
						{seatData.place}
					</button>
				</PopoverTrigger>

				<PopoverContent className="w-60">
					<div>
						<div className="flex items-center justify-between gap-4">
							<span className="text-xs text-zinc-500">{t('ticketType')}</span>
							<span className="text-xs font-medium">{ticketType?.name ?? t('unknown')}</span>
						</div>

						<div className="mt-2 flex items-center justify-between gap-4">
							<span className="text-xs text-zinc-500">{t('price')}</span>

							<span className="font-semibold text-xs">
								{ticketType ? formatCurrency(ticketType.price, currencyIso, language ) : t('unavailable')}
							</span>
						</div>
					</div>

					<footer className="mt-4 flex justify-between gap-3 border-t border-zinc-200 pt-3">
						{isSelected ? (
							<Button type="button" variant="destructive" size="sm" onClick={handleToggle}>
								{t('removeFromCart')}
							</Button>
						) : (
							<Button type="button" variant="default" size="sm" disabled={!ticketType} onClick={handleToggle}>
								{t('addToCart')}
							</Button>
						)}

						<Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
							{t('close')}
						</Button>
					</footer>
				</PopoverContent>
			</Popover>
		);
	}
);

Seat.displayName = 'Seat';