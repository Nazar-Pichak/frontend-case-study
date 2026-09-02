// Type definitions for API functions
type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;
type RequestBody = Record<string, unknown>;

type FetchData = <T>(url: string, requestOptions: RequestInit) => Promise<T | undefined>;
type ApiGet = <T>(url: string, params?: QueryParams) => Promise<T | undefined>;
type ApiPost = <T>(url: string, data: RequestBody) => Promise<T | undefined>;
type ApiPut = <T>(url: string, data: RequestBody) => Promise<T | undefined>;
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
export interface TicketTypes {
    id: string;
    name: string;
    price: number;
}

export interface Seats {
    seatId: string;
    place: number;
    ticketTypeId: string;
}

export interface SeatRows {
    seatRow: number;
    seats: Seats[];
}

export interface SeatingData {
    ticketTypes: TicketTypes[];
    seatRows: SeatRows[];
}

// User datails, login, order interfaces
export interface UserDetails {
    email: string;
    firstName: string;
    lastName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user: UserDetails;
}

export interface OrderTicket {
    ticketTypeId: string;
    seatId: string;
}

export interface CreateOrderRequest {
    eventId: string;
    tickets: OrderTicket[];
    user: UserDetails;
}

export interface CreateOrderResponse {
    message: string;
    orderId: string;
    tickets: unknown[];
    user: UserDetails;
    totalAmount: number;
}

export interface StoredOrder {
	orderId: string;
	totalAmount: number;
}