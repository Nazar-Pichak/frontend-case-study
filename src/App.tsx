import { useEffect, useState } from "react";
import { formatCurrency } from '@/lib/utils.ts';
import { apiGet, apiPost } from "@/lib/api.ts";
import { SeatingMap } from '@/components/SeatingMap.tsx';
import { CartSummary } from "@/components/CartSummary.tsx";
import { LoginDialog } from '@/components/LoginDialog.tsx';
import { CheckoutDialog } from "@/components/ChekoutDialog.tsx";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Spinner } from '@/components/ui/spinner.tsx';
import {
	EventData,
	SeatingData,
	Seats,
	UserDetails,
	LoginRequest,
	LoginResponse,
	CreateOrderResponse
} from "@/lib/types.ts";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';

import './App.css';


function App() {

	const [eventData, setEventData] = useState<EventData | null>(null);
	const [seatingData, setSeatingData] = useState<SeatingData | null>(null);
	const [selectedSeats, setSelectedSeats] = useState<Seats[]>([]);
	const [loggedInUser, setLoggedInUser] = useState<UserDetails | null>(null);
	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [checkoutError, setCheckoutError] = useState<string | null>(null);
	const [completedOrder, setCompletedOrder] = useState<CreateOrderResponse | null>(null);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);

	// Fetch data based on eventId in case of multiple events,
	// for now we will use the first eventId from the eventData
	const eventId = eventData?.eventId;

	useEffect(() => {
		const fetchEventData = async (): Promise<void> => {
			try {
				const response = await apiGet<EventData>("/event/");

				if (response) {
					setEventData(response);
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					console.error(error.message);
				}
			}
		};

		void fetchEventData();
	}, []);

	useEffect(() => {
		if (!eventId) {
			return;
		}

		const fetchSeatingData = async (): Promise<void> => {
			try {
				const response = await apiGet<SeatingData>(`/event-tickets?eventId=${eventId}`);

				if (response) {
					setSeatingData(response);
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					console.error(error.message);
				}
			}
		};

		void fetchSeatingData();
	}, [eventId]);

	// Handle seat selection and deselection
	const handleToggleSeat = (seat: Seats) => {
		setSelectedSeats((currentSeats) => {
			const isSelected = currentSeats.some((currentSeat) => currentSeat.seatId === seat.seatId);

			if (isSelected) {
				return currentSeats.filter((currentSeat) => currentSeat.seatId !== seat.seatId);
			}

			return [...currentSeats, seat];
		});
	};

	// calculate total price for all tickets in the cart
	const totalPrice = selectedSeats.reduce((total, seat) => {
		const ticketType = seatingData?.ticketTypes.find(
			(type) => type.id === seat.ticketTypeId
		);

		return total + (ticketType?.price ?? 0);
	}, 0);

	// error handling
	const getErrorMessage = (error: unknown) => {
		if (error instanceof Error) {
			return error.message;
		}

		return 'An unexpected error occurred.';
	};

	const createOrder = async (user: UserDetails) => {
		if (!eventData) {
			throw new Error('Event data is not available.');
		}

		if (selectedSeats.length === 0) {
			throw new Error('Select at least one seat.');
		}

		const order = await apiPost<CreateOrderResponse>('/order', {
			eventId: eventData.eventId,
			tickets: selectedSeats.map((seat) => ({ ticketTypeId: seat.ticketTypeId, seatId: seat.seatId })),
			user,
		});

		if (!order) {
			throw new Error('The order could not be created.');
		}

		setCompletedOrder(order);
		setSelectedSeats([]);
		setIsCheckoutOpen(false);
	};

	const handleGuestCheckout = async (user: UserDetails) => {
		setIsSubmitting(true);
		setCheckoutError(null);

		try {
			await createOrder(user);
		} catch (error) {
			setCheckoutError(getErrorMessage(error));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleLoginCheckout = async (credentials: LoginRequest) => {
		setIsSubmitting(true);
		setCheckoutError(null);

		try {
			const loginResponse = await apiPost<LoginResponse>(
				'/login',
				{
					email: credentials.email,
					password: credentials.password,
				}
			);

			if (!loginResponse) {
				throw new Error('Sign in failed.');
			}

			setLoggedInUser(loginResponse.user);
			await createOrder(loginResponse.user);
		} catch (error) {
			setCheckoutError(getErrorMessage(error));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleStandaloneLogin = async (credentials: LoginRequest) => {
		setIsLoginSubmitting(true);
		setLoginError(null);

		try {
			const response = await apiPost<LoginResponse>('/login', {
				email: credentials.email,
				password: credentials.password,
			});

			if (!response) {
				throw new Error('Sign in failed.');
			}

			setLoggedInUser(response.user);
			setIsLoginOpen(false);
		} catch (error) {
			setLoginError(getErrorMessage(error));
		} finally {
			setIsLoginSubmitting(false);
		}
	};

	// hide success message after 5 seconds
	useEffect(() => {
		if (!completedOrder) {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			setCompletedOrder(null);
		}, 5000);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [completedOrder]);

	return (
		<div className="flex flex-col grow relative">
			{/* header (wrapper) */}
			<nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
					{/* application/author image/logo placeholder */}
					<div className="max-w-[250px] w-full flex">
						<div className="bg-zinc-100 rounded-md size-12" />
					</div>
					{/* app/author title/name placeholder */}
					<div className="bg-zinc-100 rounded-md h-8 w-[200px]" />
					{/* user menu */}
					<div className="flex w-full max-w-[250px] justify-end">
						{loggedInUser ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost">
										<div className="flex items-center gap-2">
											<Avatar>
												<AvatarImage
													src={`https://source.boringavatars.com/marble/120/${encodeURIComponent(
														loggedInUser.email
													)}?colors=25106C,7F46DB`}
													alt=""
												/>

												<AvatarFallback>
													{loggedInUser.firstName.charAt(0)}
													{loggedInUser.lastName.charAt(0)}
												</AvatarFallback>
											</Avatar>

											<div className="flex flex-col text-left">
												<span className="text-sm font-medium">
													{loggedInUser.firstName}{' '}
													{loggedInUser.lastName}
												</span>

												<span className="text-xs text-zinc-500">
													{loggedInUser.email}
												</span>
											</div>
										</div>
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent className="w-[250px]">
									<DropdownMenuLabel>
										{loggedInUser.firstName}{' '}
										{loggedInUser.lastName}
									</DropdownMenuLabel>

									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										<DropdownMenuItem onSelect={() => setLoggedInUser(null)}>
											Logout
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button type="button" variant="default" onClick={() => {
								setLoginError(null);
								setIsLoginOpen(true);
							}}
							>
								Login
							</Button>
						)}
					</div>
				</div>
			</nav>

			{/* main body (wrapper) */}
			<main className="grow flex flex-col justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg m-auto p-4 flex items-center flex-col-reverse lg:flex-row lg:items-start grow gap-3 w-full ">
					{/* seating card */}
					<div className="bg-white rounded-md grow overflow-x-auto overflow-y-auto p-3 self-stretch shadow-sm" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gridAutoRows: '40px' }}>

						{seatingData ? (
							<SeatingMap
								seatRows={seatingData.seatRows}
								ticketTypes={seatingData.ticketTypes}
								selectedSeats={selectedSeats}
								currencyIso={eventData?.currencyIso ?? 'CZK'}
								onToggleSeat={handleToggleSeat} />
						) : (
							<>
								{/* seating loading state (spiner) */}
								<Spinner label="Loading seating data" />
							</>
						)}

					</div>

					{/* event info */}
					<aside className="w-full max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
						{eventData ? (
							<>
								{/* event header image placeholder */}
								<div className="bg-zinc-100 rounded-md h-32" style={{ backgroundImage: `url(${eventData?.headerImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
								{/* event name */}
								<h1 className="text-xl text-zinc-900 font-semibold">{eventData?.namePub}</h1>
								{/* event description */}
								<p className="text-sm text-zinc-500">{eventData?.description}</p>
								{/* event date, time and place */}
								<small className="text-xs text-zinc-900"><em>Datum zahájení: {eventData?.dateFrom?.slice(0, 10)} v {eventData?.dateFrom?.slice(11, 16)}</em></small>
								<small className="text-xs text-zinc-900"><em>Datum ukončení: {eventData?.dateTo?.slice(0, 10)} v {eventData?.dateTo?.slice(11, 16)}</em></small>
								<small className="text-xs text-zinc-900"><em>Místo konání: {eventData?.place.slice(12,)}</em></small>
							</>
						) : (
							<>
								{/* event loading state (spiner) */}
								<Spinner label="Loading event data" />
							</>
						)}

						{/* add to calendar button */}
						<Button variant="default">
							Add to calendar
						</Button>
					</aside>
				</div>
			</main>

			{/* bottom cart affix (wrapper) */}
			<footer className="sticky bottom-0 left-0 right-0 border-t border-zinc-200 bg-white">
				<div className="mx-auto flex justify-between max-w-screen-lg flex-col gap-4 p-4 md:flex-row md:items-center md:p-6">
					{/* Total */}
					<div className="flex shrink-0 flex-col">
						<span>
							Total for {selectedSeats.length}{' '}
							{selectedSeats.length === 1 ? 'ticket' : 'tickets'}
						</span>

						<span className="text-2xl font-semibold">
							{eventData ? formatCurrency(totalPrice, eventData.currencyIso) : '—'}
						</span>
					</div>

					{/* Selected seats */}
					<CartSummary
						selectedSeats={selectedSeats}
						seatRows={seatingData?.seatRows ?? []}
						ticketTypes={seatingData?.ticketTypes ?? []}
						currencyIso={eventData?.currencyIso ?? 'CZK'}
						onRemoveSeat={handleToggleSeat}
					/>

					{/* Checkout */}
					<Button
						type="button"
						variant="default"
						disabled={selectedSeats.length === 0 || isSubmitting}
						className="shrink-0"
						onClick={() => {
							setCheckoutError(null);
							setCompletedOrder(null);

							if (loggedInUser) {
								void handleGuestCheckout(loggedInUser);
								return;
							}

							setIsCheckoutOpen(true);
						}}
					>
						{isSubmitting ? 'Creating order...' : 'Checkout now'}
					</Button>
				</div>
			</footer>

			{/* success message dialog */}
			{completedOrder && (
				<div
					className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-md border border-green-200 bg-green-50 p-4 text-green-800 shadow-lg"
					role="status"
					aria-live="polite"
				>
					<p className="font-semibold">Order created successfully</p>
					<p className="mt-1 text-sm">Order ID: {completedOrder.orderId}</p>
					<p className="text-sm">{completedOrder.message}</p>
					<p className="mt-2 text-sm font-semibold">
						Total:{' '}
						{eventData ? formatCurrency(completedOrder.totalAmount, eventData.currencyIso): completedOrder.totalAmount}
					</p>
				</div>
			)}

			{/* checkout dialog */}
			<CheckoutDialog open={isCheckoutOpen} isSubmitting={isSubmitting} errorMessage={checkoutError}
				onClose={() => { setCheckoutError(null), setIsCheckoutOpen(false) }}
				onGuestSubmit={handleGuestCheckout}
				onLoginSubmit={handleLoginCheckout}
			/>

			{/* login dialog */}
			<LoginDialog open={isLoginOpen} isSubmitting={isLoginSubmitting} errorMessage={loginError}
				onClose={() => { setLoginError(null), setIsLoginOpen(false) }}
				onSubmit={handleStandaloneLogin}
			/>

		</div>
	);
}

export default App;
