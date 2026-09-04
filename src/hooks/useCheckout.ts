import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation.ts';

import { apiPost } from '@/lib/api.ts';
import { getApiErrorKey } from '@/lib/api-errors.ts';

import type { CreateOrderResponse, EventData, LoginRequest, Seats, UserDetails, StoredOrder } from '@/lib/types.ts';

const ORDER_NOTIFICATION_DURATION_MS = 5000;

interface UseCheckoutOptions {
	eventData: EventData | null;
	selectedSeats: Seats[];
	clearCart: () => void;
	authenticate: (credentials: LoginRequest) => Promise<UserDetails>;
	saveAuthenticatedOrder: (email: string, order: StoredOrder) => void;
}

interface UseCheckoutResult {
	completedOrder: CreateOrderResponse | null;
	checkoutError: string | null;
	isSubmitting: boolean;
	unavailableSeatIds: Set<string>;
	mySeatIds: Set<string>;
	submitCheckout: (user: UserDetails, isAuthenticatedPurchase?: boolean) => Promise<boolean>;
	submitLoginCheckout: (credentials: LoginRequest) => Promise<boolean>;
	resetCheckoutFeedback: () => void;
	clearCheckoutError: () => void;
}

export function useCheckout({eventData, selectedSeats, clearCart, authenticate, saveAuthenticatedOrder}: UseCheckoutOptions): UseCheckoutResult {
	const { t } = useTranslation();
	const [completedOrder, setCompletedOrder] = useState<CreateOrderResponse | null>(null);
	const [checkoutError, setCheckoutError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	// These sets contain only seat IDs because checking membership
	// is faster and simpler than repeatedly searching full seat objects.
	const [unavailableSeatIds, setUnavailableSeatIds] = useState<Set<string>>(() => new Set());
	const [mySeatIds, setMySeatIds] = useState<Set<string>>(() => new Set());

	const createOrder = async (user: UserDetails, isAuthenticatedPurchase: boolean): Promise<void> => {
		if (!eventData) {
			throw new Error('Event data is not available.');
		}

		if (selectedSeats.length === 0) {
			throw new Error('Select at least one seat.');
		}

		// Do not automatically retry this POST request.
		// The server could create an order even if its response times out,
		// and repeating the request could create a duplicate purchase.
		const order = await apiPost<CreateOrderResponse>('/order',
				{
					eventId: eventData.eventId,
					tickets: selectedSeats.map((seat) => ({
                        ticketTypeId: seat.ticketTypeId,
                        seatId: seat.seatId,
						})
					),
					user,
				}
			);

		// apiPost currently includes undefined in its return type,
		// so reject an empty response explicitly.
		if (!order) {
			throw new Error('The order could not be created.');
		}

		setCompletedOrder(order);

		// Copy the IDs before clearCart removes the selected seats.
		const purchasedSeatIds = selectedSeats.map((seat) => seat.seatId);

		// Create a new Set instead of mutating the previous React state.
		// Every purchased seat becomes unavailable for further selection.
		setUnavailableSeatIds((currentIds) => {
			const updatedIds = new Set(currentIds);

			purchasedSeatIds.forEach((seatId) => {
				updatedIds.add(seatId);
			});

			return updatedIds;
		});

		if (isAuthenticatedPurchase) {
			// Only authenticated purchases are presented as "My seat".
			// Guest purchases remain unavailable without user ownership.
			setMySeatIds((currentIds) => {
				const updatedIds = new Set(currentIds);

				purchasedSeatIds.forEach((seatId) => {
					updatedIds.add(seatId);
				});

				return updatedIds;
			});

			// Store only the information needed by the order history dialog.
			saveAuthenticatedOrder(user.email, {
				orderId: order.orderId,
				totalAmount: order.totalAmount,
			});

		}

		clearCart();
	};

	const submitCheckout = async (user: UserDetails, isAuthenticatedPurchase = false): Promise<boolean> => {
		setIsSubmitting(true);
		setCheckoutError(null);

		try {
			await createOrder(user, isAuthenticatedPurchase);
			// App uses this result to close dialogs only after
			// the order has been created successfully.
			return true;

		} catch (error: unknown) {

			setCheckoutError(t(getApiErrorKey(error)));
			return false;

		} finally {
			setIsSubmitting(false);
		}
	};

	const submitLoginCheckout = async (credentials: LoginRequest): Promise<boolean> => {
		setIsSubmitting(true);
		setCheckoutError(null);

		try {
			let user: UserDetails;

			try {
				// Authentication errors require login-specific messages,
				// such as incorrect email or password.
				user = await authenticate(credentials);
			} catch (error: unknown) {

				setCheckoutError(t(getApiErrorKey(error, 'login')));
				return false;
			}

			try {
				// Once authentication succeeds, order failures must use
				// general API messages rather than login error messages.
				await createOrder(user, true);
				return true;
			} catch (error: unknown) {

				setCheckoutError(t(getApiErrorKey(error)));
				return false;
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetCheckoutFeedback = () => {
		// Remove results from the previous attempt before starting
		// a new checkout flow.
		setCheckoutError(null);
		setCompletedOrder(null);
	};

	const clearCheckoutError = () => {
		setCheckoutError(null);
	};

	useEffect(() => {
		if (!completedOrder) {
			return;
		}

		// Keep the success notification visible long enough to be read,
		// then remove it automatically without user interaction.
		const timeoutId = window.setTimeout(() => {setCompletedOrder(null)}, ORDER_NOTIFICATION_DURATION_MS);

        // Prevent an outdated timer from hiding a newer notification.
		return () => {window.clearTimeout(timeoutId)};

	}, [completedOrder]);

	return {
		completedOrder,
		checkoutError,
		isSubmitting,
		unavailableSeatIds,
		mySeatIds,
		submitCheckout,
		submitLoginCheckout,
		resetCheckoutFeedback,
		clearCheckoutError,
	};
}