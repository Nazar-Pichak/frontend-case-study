import { useEffect, useRef } from 'react';

import { formatCurrency } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import { useTranslation } from '@/hooks/useTranslation.ts';

import type { StoredOrder } from '@/lib/types.ts';

interface OrderHistoryDialogProps {
	open: boolean;
	orders: StoredOrder[];
	currencyIso: string;
	onClose: () => void;
	onClear: () => void;
}

export function OrderHistoryDialog({ open, orders, currencyIso, onClose, onClear }: OrderHistoryDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const { t, language } = useTranslation();

	// Synchronize React's open state with the native dialog element.
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
			aria-labelledby="order-history-dialog-title"
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
		>
			<div className="p-6">
				<header className="mb-6 flex items-start justify-between gap-4">
					<div>
						<h2 id="order-history-dialog-title" className="text-xl font-semibold">
							{t('orderHistory')}
						</h2>

						<p className="mt-1 text-sm text-zinc-500">
							{t('orderCount')}: {orders.length}
						</p>
					</div>

					<Button type="button" variant="outline" size="sm" onClick={onClose}>
						{t('close')}
					</Button>
				</header>

				{orders.length === 0 ? (
					<p className="py-8 text-center text-sm text-zinc-500">
						{t('noOrderHistory')}
					</p>
				) : (
					<div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
						{orders.map((order) => (
							<article key={order.orderId} className="rounded-md border border-zinc-200 p-4">
								<div className="flex items-start justify-between gap-4">
									<span className="text-sm text-zinc-500">
										{t('orderId')}
									</span>

									<span className="break-all text-right text-sm font-medium">
										{order.orderId}
									</span>
								</div>

								<div className="mt-3 flex items-center justify-between gap-4 border-t border-zinc-200 pt-3">
									<span className="text-sm text-zinc-500">
										{t('total')}
									</span>

									<span className="font-semibold text-zinc-900">
										{formatCurrency(order.totalAmount,currencyIso,language)}
									</span>
								</div>
							</article>
						))}
					</div>
				)}

				<footer className="mt-6 flex justify-end border-t border-zinc-200 pt-4">
					<Button type="button" variant="destructive" disabled={orders.length === 0} onClick={onClear}>
						{t('clearOrderHistory')}
					</Button>
				</footer>
			</div>
		</dialog>
	);
}