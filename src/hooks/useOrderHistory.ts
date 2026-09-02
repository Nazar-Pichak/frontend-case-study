import { useState } from 'react';
import type { StoredOrder } from '@/lib/types.ts';

// Keep each user's orders under a normalized email address.
type OrderHistoryStorage = Record<string, StoredOrder[]>;

// Use one stable key for reading, updating, and removing stored history.
const ORDER_HISTORY_STORAGE_KEY = 'eventron-order-history';

const loadOrderHistory = (): OrderHistoryStorage => {
	try {
		const storedHistory = localStorage.getItem(ORDER_HISTORY_STORAGE_KEY);

		// localStorage contains text, so convert the saved JSON
		// back into an object before using it as React state.
		return storedHistory ? (JSON.parse(storedHistory) as OrderHistoryStorage): {};
	} catch {
		// Invalid JSON should not prevent the application from starting.
		// Remove the corrupted value and continue with empty history.
		localStorage.removeItem(ORDER_HISTORY_STORAGE_KEY);
		return {};
	}
};

export function useOrderHistory(userEmail: string | null) {
	const [history, setHistory] = useState<OrderHistoryStorage>(loadOrderHistory);
	// Email addresses are case-insensitive. Normalization prevents
	// the same user from receiving multiple separate history entries.
	const normalizedEmail = userEmail?.trim().toLowerCase() ?? null;
	const orders = normalizedEmail ? history[normalizedEmail] ?? []: [];

	const saveHistory = (updateHistory: (currentHistory: OrderHistoryStorage) => OrderHistoryStorage) => {
		// A functional state update always works with the latest state,
		// even when several updates happen close together.
		setHistory((currentHistory) => {
			const updatedHistory = updateHistory(currentHistory);

			// Keep browser storage synchronized with React state.
			localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));

			return updatedHistory;
		});
	};

	const addOrder = (email: string, order: StoredOrder) => {
		// Use the email from the completed checkout because React may
		// not have updated the logged-in user state yet.
		const orderOwnerEmail =email.trim().toLowerCase();

		saveHistory((currentHistory) => ({
			...currentHistory,
			[orderOwnerEmail]: [order, ...(currentHistory[orderOwnerEmail] ?? []),],
		}));
	};

	const clearOrderHistory = () => {
		if (!normalizedEmail) {
			return;
		}

		saveHistory((currentHistory) => {
			// Copy the object before deleting the current user's entry
			// so the existing React state is never mutated directly.
			const updatedHistory = {...currentHistory};
			delete updatedHistory[normalizedEmail];
			return updatedHistory;
		});
	};

	return {
		orders,
		addOrder,
		clearOrderHistory,
	};
}