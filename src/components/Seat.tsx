import { Button } from '@/components/ui/button.tsx';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover.tsx';
import type { Seats, TicketTypes } from '@/lib/types.ts';
import { cn } from '@/lib/utils.ts';
import React from 'react';

interface SeatProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	seatData: Seats;
	ticketType: TicketTypes | undefined;
	isSelected: boolean;
	onToggle: (seat: Seats) => void;
}

export const Seat = React.forwardRef<HTMLButtonElement, SeatProps>(
	(
		{
			seatData,
			ticketType,
			isSelected,
			onToggle,
			className,
			...buttonProps
		},
		ref
	) => {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<button {...buttonProps} ref={ref} type="button" className={cn(
						'flex size-8 items-center justify-center rounded-full border text-xs font-medium transition-colors',
						isSelected
							? 'border-violet-700 bg-violet-700 text-white ring-2 ring-violet-200'
							: 'border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-600 hover:bg-violet-600 hover:text-white',
						className
					)}
						aria-label={`Seat ${seatData.place}${isSelected ? ', selected' : ', available'
							}`}
						aria-pressed={isSelected}
					>
						{seatData.place}
					</button>
				</PopoverTrigger>

				<PopoverContent>
					<div className="">
						<div className="flex items-center justify-between gap-4">
							<span className="text-sm text-zinc-500">Ticket type</span>
							<span className="text-sm font-medium">{ticketType?.name ?? 'Unknown'}</span>
						</div>

						<div className="mt-2 flex items-center justify-between gap-4">
							<span className="text-sm text-zinc-500">Price</span>
							<span className="font-semibold">
								{ticketType ? `${ticketType.price.toLocaleString('cs-CZ')} Kč` : 'Unavailable'}
							</span>
						</div>
					</div>

					<footer className="mt-3 flex flex-col">
						{isSelected ? (
							<Button variant="destructive" size="sm" onClick={() => onToggle(seatData)}>
								Remove from cart
							</Button>
						) : (
							<Button variant="default" size="sm" onClick={() => onToggle(seatData)}>
								Add to cart
							</Button>
						)}
					</footer>
				</PopoverContent>
			</Popover>
		);
	}
);

Seat.displayName = 'Seat';