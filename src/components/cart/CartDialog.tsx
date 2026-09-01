import { CartSummary } from '@/components/cart/CartSummary.tsx';
import { Button } from '@/components/ui/button.tsx';
import { formatCurrency } from '@/lib/utils.ts';
import type {
    Seats,
    SeatRows,
    TicketTypes,
} from '@/lib/types.ts';
import { useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation.ts';

interface CartDialogProps {
    open: boolean;
    selectedSeats: Seats[];
    seatRows: SeatRows[];
    ticketTypes: TicketTypes[];
    currencyIso: string;
    totalPrice: number;
    isSubmitting: boolean;
    onClose: () => void;
    onRemoveSeat: (seat: Seats) => void;
    onCheckout: () => void;
    errorMessage: string | null;
}

export function CartDialog({
    open,
    selectedSeats,
    seatRows,
    ticketTypes,
    currencyIso,
    totalPrice,
    isSubmitting,
    errorMessage,
    onClose,
    onRemoveSeat,
    onCheckout,
}: CartDialogProps) {
    const { language, t } = useTranslation();
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (open && !dialog.open) {
            dialog.showModal();
        }

        if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            className="w-[calc(100%-2rem)] max-w-2xl rounded-lg bg-white p-0 shadow-xl backdrop:bg-black/40"
            aria-labelledby="cart-dialog-title"
            onCancel={(event) => {
                event.preventDefault();

                if (!isSubmitting) {
                    onClose();
                }
            }}
        >
            <div className="p-6">
                <header className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 id="cart-dialog-title" className="text-xl font-semibold">{t('yourCart')}</h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            {t('ticketCount')}: {selectedSeats.length}
                        </p>
                    </div>

                    <Button type="button" variant="outline" size="sm" disabled={isSubmitting} onClick={onClose}>
                        {t('close')}
                    </Button>
                </header>

                {errorMessage && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                        {errorMessage}
                    </div>
                )}

                <CartSummary
                    selectedSeats={selectedSeats}
                    seatRows={seatRows}
                    ticketTypes={ticketTypes}
                    currencyIso={currencyIso}
                    onRemoveSeat={onRemoveSeat}
                />

                <footer className="mt-6 flex items-center justify-between gap-4 border-t border-zinc-200 pt-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-zinc-500">{t('total')}</span>

                        <span className="text-2xl font-semibold">
                            {formatCurrency(totalPrice, currencyIso, language)}
                        </span>
                    </div>

                    <Button type="button" disabled={selectedSeats.length === 0 || isSubmitting} onClick={onCheckout}>
                        {isSubmitting ? t('creatingOrder') : t('checkoutNow')}
                    </Button>
                </footer>
            </div>
        </dialog>
    );
}