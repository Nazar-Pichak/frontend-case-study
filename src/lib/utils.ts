import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currencyIso: string) {
    return new Intl.NumberFormat('cs-CZ', {
        style: 'currency',
        currency: currencyIso,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}
