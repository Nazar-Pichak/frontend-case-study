import { useTranslation } from '@/hooks/useTranslation.ts';

import { formatCurrency } from '@/lib/utils.ts';
import type { CreateOrderResponse } from '@/lib/types.ts';

interface OrderNotificationProps {
    order: CreateOrderResponse | null;
    currencyIso?: string;
}

export function OrderNotification({order, currencyIso}: OrderNotificationProps) {
    const { t, language } = useTranslation();

    if (!order) {
        return null;
    }

    return (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800 shadow-lg" role="status" aria-live="polite">
            <p className="font-semibold">{t('orderCreated')}</p>
            <p className="mt-1 text-sm">{t('orderId')}: {order.orderId}</p>
            <p className="text-sm">{order.message}</p>
            <p className="mt-2 text-sm font-semibold">
                {t('total')}:{' '}
                {currencyIso ? formatCurrency(order.totalAmount, currencyIso, language) : order.totalAmount}
            </p>
        </div>
    );
}