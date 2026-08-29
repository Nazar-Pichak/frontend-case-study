import { type ClassValue, clsx } from "clsx"
import type { Language } from '@/lib/i18n.ts';
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency( amount: number, currencyIso: string, language: Language) {
    return new Intl.NumberFormat(
        language === 'cs' ? 'cs-CZ' : 'en-US',
        {
            style: 'currency',
            currency: currencyIso,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }
    ).format(amount);
}
