import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCart } from '@/hooks/useCart.ts';
import type { Seats, TicketTypes } from '@/lib/types.ts';

const ticketTypes: TicketTypes[] = [
	{
		id: 'regular-ticket',
		name: 'Regular Ticket',
		price: 500,
	},
	{
		id: 'vip-ticket',
		name: 'VIP Ticket',
		price: 900,
	},
];

const regularSeat: Seats = {
	seatId: 'seat-1',
	place: 1,
	ticketTypeId: 'regular-ticket',
};

const vipSeat: Seats = {
	seatId: 'seat-2',
	place: 2,
	ticketTypeId: 'vip-ticket',
};

describe('useCart', () => {
	it('starts with an empty cart', () => {
		const { result } = renderHook(() =>
			useCart(ticketTypes)
		);

		expect(result.current.selectedSeats).toEqual([]);
		expect(result.current.totalPrice).toBe(0);
	});

	it('adds an unselected seat', () => {
		const { result } = renderHook(() =>
			useCart(ticketTypes)
		);

		act(() => {
			result.current.toggleSeat(regularSeat);
		});

		expect(result.current.selectedSeats).toEqual([
			regularSeat,
		]);
		expect(result.current.totalPrice).toBe(500);
	});

	it('removes an already selected seat', () => {
		const { result } = renderHook(() =>
			useCart(ticketTypes)
		);

		act(() => {
			result.current.toggleSeat(regularSeat);
			result.current.toggleSeat(regularSeat);
		});

		expect(result.current.selectedSeats).toEqual([]);
		expect(result.current.totalPrice).toBe(0);
	});

	it('calculates the total price of all selected seats', () => {
		const { result } = renderHook(() =>
			useCart(ticketTypes)
		);

		act(() => {
			result.current.toggleSeat(regularSeat);
			result.current.toggleSeat(vipSeat);
		});

		expect(result.current.selectedSeats).toHaveLength(2);
		expect(result.current.totalPrice).toBe(1400);
	});

	it('clears all selected seats', () => {
		const { result } = renderHook(() =>
			useCart(ticketTypes)
		);

		act(() => {
			result.current.toggleSeat(regularSeat);
			result.current.toggleSeat(vipSeat);
		});

		act(() => {
			result.current.clearCart();
		});

		expect(result.current.selectedSeats).toEqual([]);
		expect(result.current.totalPrice).toBe(0);
	});

	it('uses zero when a seat has no matching ticket type', () => {
		const unknownSeat: Seats = {
			seatId: 'unknown-seat',
			place: 3,
			ticketTypeId: 'missing-ticket-type',
		};

		const { result } = renderHook(() =>
			useCart(ticketTypes)
		);

		act(() => {
			result.current.toggleSeat(unknownSeat);
		});

		expect(result.current.selectedSeats).toEqual([
			unknownSeat,
		]);
		expect(result.current.totalPrice).toBe(0);
	});
});