import { useTranslation } from '@/hooks/useTranslation.ts';

import { formatCurrency } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import { RemoveIcon } from '@/components/ui/remove-icon.tsx';

import type { Seats, SeatRows, TicketTypes } from '@/lib/types.ts';
interface CartSummaryProps {
    selectedSeats: Seats[];
    seatRows: SeatRows[];
    ticketTypes: TicketTypes[];
    currencyIso: string;
    onRemoveSeat: (seat: Seats) => void;
}

export function CartSummary({ selectedSeats, seatRows, ticketTypes, currencyIso, onRemoveSeat }: CartSummaryProps) {
    const { language, t } = useTranslation();

    if (selectedSeats.length === 0) {
        return (<p className="text-sm text-zinc-500">{t('noSeatsSelected')}</p>);
    }

    return (
        <ul className="flex max-h-32 flex-1 flex-col gap-2 overflow-y-auto" aria-label="Selected seats">
            {selectedSeats.map((seat) => {

                const seatRow = seatRows.find((row) => row.seats.some(
                        (rowSeat) => rowSeat.seatId === seat.seatId
                    )
                );

                const ticketType = ticketTypes.find((type) => type.id === seat.ticketTypeId);

                return (
                    <li key={seat.seatId} className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 px-3 py-2">
                        <div className="min-w-0">
                            <p className="text-sm font-medium">
                                {t('row')} {seatRow?.seatRow ?? '—'},{' '}
                                {t('seat').toLowerCase()} {seat.place}
                            </p>

                            <p className="truncate text-xs text-zinc-500">
                                {ticketType?.name ?? t('unknown')}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <span className="text-sm font-semibold">
                                {ticketType ? formatCurrency(ticketType.price, currencyIso, language): '—'}
                            </span>

                            <Button type="button" variant="link" size="sm" onClick={() => onRemoveSeat(seat)} aria-label={`Remove seat ${seat.place} from cart`}>
                                <RemoveIcon/>
                            </Button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}