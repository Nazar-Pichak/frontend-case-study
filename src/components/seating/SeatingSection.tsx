import { useTranslation } from '@/hooks/useTranslation.ts';

import { Spinner } from '@/components/ui/spinner.tsx';
import { SeatingMap } from '@/components/seating/SeatingMap.tsx';
import { ErrorMessage } from '@/components/ui/error-message.tsx';
import { SeatingStage } from '@/components/seating/SeatingStage.tsx';
import { SeatingLegend } from '@/components/seating/SeatingLegend.tsx';

import type { TranslationKey } from '@/lib/i18n.ts';
import type { Seats, SeatingData } from '@/lib/types.ts';

interface SeatingSectionProps {
    seatingData: SeatingData | null;
    currencyIso: string | null;
    errorKey: TranslationKey | null;
    selectedSeats: Seats[];
    unavailableSeatIds: Set<string>;
    mySeatIds: Set<string>;
    showMySeats: boolean;
    onToggleSeat: (seat: Seats) => void;
}

export function SeatingSection({
    seatingData,
    currencyIso,
    errorKey,
    selectedSeats,
    unavailableSeatIds,
    mySeatIds,
    showMySeats,
    onToggleSeat,
}: SeatingSectionProps) {

    const { t } = useTranslation();

    return (
        <div className="flex flex-col self-stretch rounded-md bg-white p-3 shadow-lg lg:grow"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gridAutoRows: '40px' }}>
            {/* Stage */}
            <SeatingStage />

            {/* Keep the stage and legend visible while the seat rows change state. */}
            <div className="flex w-full min-w-0 grow justify-center">
                {errorKey ? (
                    <ErrorMessage message={t(errorKey)} />
                ) : seatingData && currencyIso ? (
                    <SeatingMap
                        seatRows={seatingData.seatRows}
                        ticketTypes={seatingData.ticketTypes}
                        currencyIso={currencyIso}
                        selectedSeats={selectedSeats}
                        unavailableSeatIds={unavailableSeatIds}
                        mySeatIds={mySeatIds}
                        showMySeats={showMySeats}
                        onToggleSeat={onToggleSeat}
                    />
                ) : (
                    <Spinner label={t('loadingSeatingData')} />
                )}
            </div>
            {/* Legend */}
            <SeatingLegend showMySeats={showMySeats} />
        </div>
    );
}