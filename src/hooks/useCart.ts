import { useState } from 'react';
import type { Seats, TicketTypes } from '@/lib/types.ts';

interface UseCartResult {
	selectedSeats: Seats[];
	totalPrice: number;
	toggleSeat: (seat: Seats) => void;
	clearCart: () => void;
}

export function useCart(ticketTypes: TicketTypes[]): UseCartResult {
	// Keep only the seats currently selected by the user.
	// Ticket prices are resolved separately from ticketTypes,
	// because each seat contains only a ticketTypeId.
	const [selectedSeats, setSelectedSeats] = useState<Seats[]>([]);

	const toggleSeat = (seat: Seats) => {
		// Use a functional state update because the new cart content
		// depends on the most recent selectedSeats value.
		// This prevents updates from using a stale state value.
		setSelectedSeats((currentSeats) => {
			const isSelected = currentSeats.some(
				(currentSeat) =>
					currentSeat.seatId === seat.seatId
			);

			// Clicking an already selected seat removes it from the cart.
			if (isSelected) {
				return currentSeats.filter(
                    (currentSeat) => currentSeat.seatId !== seat.seatId
				);
			}

			// Clicking an available unselected seat appends it
			// without mutating the existing state array.
			return [...currentSeats, seat];
		});
	};

	const clearCart = () => {
		// Reset the selection after a successful order.
		// This function hides the internal state setter from App.
		setSelectedSeats([]);
	};

	// Resolve the price of every selected seat through its ticketTypeId.
	// A missing ticket type contributes zero instead of producing NaN,
	// which keeps the displayed total safe while API data is unavailable.
	const totalPrice = selectedSeats.reduce(
		(total, seat) => {
			const ticketType = ticketTypes.find(
				(type) => type.id === seat.ticketTypeId
			);

			return total + (ticketType?.price ?? 0);
		},
		0
	);

	return {
		selectedSeats,
		totalPrice,
		toggleSeat,
		clearCart,
	};
}