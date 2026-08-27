import { Seat } from '@/components/Seat.tsx';
import type { SeatRows } from '@/lib/types.ts';

interface SeatingMapProps {
    seatRows: SeatRows[];
}

export function SeatingMap({ seatRows }: SeatingMapProps) {
    const maxSeatPlace = seatRows.reduce(
        (currentMaximum, row) =>
            row.seats.reduce(
                (rowMaximum, seat) =>
                    Math.max(rowMaximum, seat.place),
                currentMaximum
            ),
        0
    );

    if (seatRows.length === 0) {
        return (
            <p className="text-center text-sm text-zinc-500">
                No seats are currently available.
            </p>
        );
    }

    return (
        <div className="min-w-max flex flex-col items-center h-full">
            {/* Stage */}
            <div className="w-full mb-8 flex justify-center">
                <div className="w-2/3 max-w-xl">
                    <div className="h-3 rounded-t-md bg-gradient-to-r from-violet-500 via-violet-700 to-violet-500 shadow-md" />

                    <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                        Stage
                    </p>
                </div>
            </div>
            {/* Seat Rows */}
            <div className="space-y-2">
                {seatRows.map((row) => {
                    const seatsByPlace = new Map(row.seats.map((seat) => [seat.place, seat]));

                    return (
                        <div key={row.seatRow} className="grid items-center gap-2" style={{ gridTemplateColumns: `2rem repeat(${maxSeatPlace}, 2rem)`, }}>
                            <span className="text-center text-sm font-semibold text-zinc-500">
                                {row.seatRow}
                            </span>

                            {Array.from({ length: maxSeatPlace }, (_, index) => index + 1).map((place) => {
                                const seat = seatsByPlace.get(place);

                                if (seat) {
                                    return (<Seat key={seat.seatId} seatData={seat} />);
                                }

                                return (
                                    <div key={`unavailable-${row.seatRow}-${place}`}
                                        className="flex size-8 cursor-not-allowed items-center justify-center rounded-full bg-zinc-200 text-zinc-400 opacity-60"
                                        aria-label={`Seat ${place} is unavailable`}
                                        title={`Seat ${place} is unavailable`}
                                    >
                                        <span className="text-xs font-medium">
                                            {place}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="w-full mt-auto flex items-center justify-center gap-6 border-t border-zinc-200 pt-4" aria-label="Seat availability legend">
                <div className="flex items-center gap-2">
                    <span className="size-4 rounded-full border border-violet-200 bg-violet-50" aria-hidden="true" />
                    <span className="text-sm text-zinc-600">Available</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="size-4 rounded-full bg-zinc-200 opacity-60" aria-hidden="true" />
                    <span className="text-sm text-zinc-600">Unavailable</span>
                </div>
            </div>

        </div>
    );
}