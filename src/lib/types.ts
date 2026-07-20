// Type definitions for API functions
type FetchData = <T>(url: string, requestOptions: RequestInit) => Promise<T | undefined>;
type ApiGet = <T>(url: string, params?: Record<string, any>) => Promise<T | undefined>;
type ApiPost = <T>(url: string, data: Record<string, any>) => Promise<T | undefined>;
type ApiPut = <T>(url: string, data: Record<string, any>) => Promise<T | undefined>;
type ApiDelete = <T>(url: string) => Promise<T | undefined>;

export type { FetchData, ApiGet, ApiPost, ApiPut, ApiDelete };

// Event data interface
export interface EventData {
    eventId: string;
    namePub: string;
    description: string;
    currencyIso: string;
    dateFrom: string;
    dateTo: string;
    headerImageUrl: string;
    place: string;
}

// Seating data interfaces
export interface TicketType {
    id: string;
    name: string;
    price: number;
}

export interface Seat {
    seatId: string;
    place: number;
    ticketTypeId: string;
}

export interface SeatRow {
    seatRow: number;
    seats: Seat[];
}

export interface SeatingData {
    ticketTypes: TicketType[];
    seatRows: SeatRow[];
}

