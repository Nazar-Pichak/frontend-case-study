import { Seat } from '@/components/Seat.tsx';
import type { SeatRows, Seats, TicketTypes } from '@/lib/types.ts';
import { useTranslation } from '@/hooks/useTranslation.ts';

interface SeatingMapProps {
    seatRows: SeatRows[];
    ticketTypes: TicketTypes[];
    currencyIso: string;
    selectedSeats: Seats[];
    unavailableSeatIds: Set<string>;
    mySeatIds: Set<string>;
    showMySeats: boolean;
    onToggleSeat: (seat: Seats) => void;
}

export function SeatingMap({
    seatRows,
    ticketTypes,
    currencyIso,
    selectedSeats,
    unavailableSeatIds,
    mySeatIds,
    showMySeats,
    onToggleSeat,
}: SeatingMapProps) {

    const { t } = useTranslation();

    const maxSeatPlace = seatRows.reduce(
        (currentMaximum, row) =>
            row.seats.reduce(
                (rowMaximum, seat) =>
                    Math.max(rowMaximum, seat.place),
                currentMaximum
            ),
        0
    );

    const selectedSeatIds = new Set(
        selectedSeats.map((seat) => seat.seatId)
    );

    if (seatRows.length === 0) {
        return (
            <p className="text-center text-sm text-zinc-500">
                {t('noSeatsAvailable')}
            </p>
        );
    }

    return (
        <div className="min-w-max flex flex-col items-center h-full">
            {/* Stage */}
            <div className="w-full mb-8 flex justify-center">
                <div className="w-2/3 max-w-xl">
                    <div className="h-3 rounded-t-md bg-violet-50 shadow-lg " />

                    <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                        {t('stage')}
                    </p>
                </div>
            </div>
            {/* Seat Rows */}
            <div className="space-y-2 border-l border-t border-zinc-200 p-4">
                {seatRows.map((row) => {
                    const seatsByPlace = new Map(row.seats.map((seat) => [seat.place, seat]));

                    return (
                        <div key={row.seatRow} className="grid items-center gap-2" style={{ gridTemplateColumns: `2rem repeat(${maxSeatPlace}, 2rem)`, }}>
                            <span className="text-center text-sm font-semibold text-zinc-500">
                                {row.seatRow}
                            </span>

                            {Array.from({ length: maxSeatPlace }, (_, index) => index + 1).map((place) => {
                                const seat = seatsByPlace.get(place);
                                const isUnavailable = seat !== undefined && unavailableSeatIds.has(seat.seatId);
                                const isMySeat = isUnavailable && showMySeats && mySeatIds.has(seat.seatId);

                                if (seat && !isUnavailable) {
                                    const ticketType = ticketTypes.find((t) => t.id === seat.ticketTypeId);
                                    return (
                                        <Seat
                                            key={seat.seatId}
                                            seatData={seat}
                                            ticketType={ticketType}
                                            currencyIso={currencyIso}
                                            isSelected={selectedSeatIds.has(seat.seatId)}
                                            onToggle={onToggleSeat} />
                                    );
                                }

                                if (seat && isMySeat) {
                                    return (
                                        <div
                                            key={`purchased-${seat.seatId}`}
                                            className="flex size-8 cursor-not-allowed items-center justify-center rounded-full border border-violet-500 bg-violet-400 text-white"
                                            aria-label={`${t('seat')} ${place}, ${t('mySeat')}`}
                                            title={`${t('seat')} ${place} – ${t('mySeat')}`}
                                        >
                                            <span className="text-xs font-semibold">{place}</span>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={`unavailable-${row.seatRow}-${place}`}
                                        className="flex size-8 cursor-not-allowed items-center justify-center rounded-full bg-zinc-200 text-zinc-400 opacity-60"
                                        aria-label={`${t('seat')} ${place}, ${t('seatUnavailable')}`}
                                        title={`${t('seat')} ${place} – ${t('seatUnavailable')}`}
                                    >
                                        <span className="text-xs font-medium">{place}</span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="w-full mt-6 lg:mt-auto flex items-center justify-center gap-6 border-t border-zinc-200 pt-4"
                aria-label={`${t('seat')} – ${t('available')} / ${t('unavailable')}`}
            >
                <div className="flex items-center gap-2">
                    <span className="size-4 rounded-full border border-violet-200 bg-violet-50" aria-hidden="true" />
                    <span className="text-sm text-zinc-600">{t('available')}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="size-4 rounded-full bg-zinc-200 opacity-60" aria-hidden="true" />
                    <span className="text-sm text-zinc-600">{t('unavailable')}</span>
                </div>

                {showMySeats && (
                    <div className="flex items-center gap-2">
                        <span className="size-4 rounded-full border border-violet-500 bg-violet-400" aria-hidden="true" />
                        <span className="text-sm text-zinc-600">{t('mySeat')}</span>
                    </div>
                )}
            </div>

        </div>
    );
}