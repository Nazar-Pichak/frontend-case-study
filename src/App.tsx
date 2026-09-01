import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation.ts';

import { apiGet, apiPost } from '@/lib/api.ts';
import { getApiErrorKey } from '@/lib/api-errors.ts';

import type { TranslationKey } from '@/lib/i18n.ts';
import type {
	CreateOrderResponse,
	EventData,
	LoginRequest,
	LoginResponse,
	SeatingData,
	Seats,
	UserDetails,
} from '@/lib/types.ts';

import { AddToCalendar } from '@/components/AddToCalendar.tsx';
import { CartDialog } from '@/components/CartDialog.tsx';
import { CheckoutDialog } from '@/components/CheckoutDialog';
import { LoginDialog } from '@/components/LoginDialog.tsx';
import { SeatingMap } from '@/components/SeatingMap.tsx';
import { ProfileDialog } from '@/components/ProfileDialog.tsx';
import { SeatingStage } from '@/components/SeatingStage.tsx';
import { SeatingLegend } from '@/components/SeatingLegend.tsx';

// refactor
import { EventDetails } from '@/components/event/EventDetails.tsx';
import { Header } from '@/layout/Header.tsx';
import { Footer } from '@/layout/Footer.tsx';
import { AuthNotification } from '@/components/notifications/AuthNotification.tsx';
import { OrderNotification } from '@/components/notifications/OrderNotification.tsx';

import { Spinner } from '@/components/ui/spinner.tsx';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button.tsx';
import { ErrorMessage } from '@/components/ui/error-message.tsx';

import './App.css';

type AuthNotification = 'login' | 'logout' | null;

function App() {
	const { t } = useTranslation();
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
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [authNotification, setAuthNotification] = useState<AuthNotification>(null);
	const [unavailableSeatIds, setUnavailableSeatIds] = useState<Set<string>>(() => new Set());
	const [isScrolled, setIsScrolled] = useState(false);
	// Store seats purchased by an authenticated user separately.
	const [mySeatIds, setMySeatIds] = useState<Set<string>>(() => new Set());
	const [eventErrorKey, setEventErrorKey] = useState<TranslationKey | null>(null);
	const [seatingErrorKey, setSeatingErrorKey] = useState<TranslationKey | null>(null);

	const avatarSrc = "/ian-dooley-d1UPkiFd04A-unsplash.jpg"
	const eventId = eventData?.eventId;

	useEffect(() => {
		const fetchEventData = async (): Promise<void> => {
			setEventErrorKey(null);

			try {
				const response = await apiGet<EventData>('/event');

				if (!response) {
					setEventErrorKey('unexpectedError');
					return;
				}

				setEventData(response);
			} catch (error: unknown) {
				// Keep technical details available for development.
				console.error('Failed to load event:', error);

				// Store a translation key instead of a fixed-language message.
				setEventErrorKey(getApiErrorKey(error));
			}
		};

		void fetchEventData();
	}, []);

	useEffect(() => {
		if (!eventId) {
			return;
		}

		const fetchSeatingData = async (): Promise<void> => {
			setSeatingErrorKey(null);

			try {
				const response = await apiGet<SeatingData>(
					`/event-tickets?eventId=${eventId}`
				);

				if (!response) {
					setSeatingErrorKey('unexpectedError');
					return;
				}

				setSeatingData(response);
			} catch (error: unknown) {
				// Keep technical details available for development.
				console.error('Failed to load seating data:', error);

				setSeatingErrorKey(getApiErrorKey(error));
			}
		};

		void fetchSeatingData();
	}, [eventId]);

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

	useEffect(() => {
		if (!authNotification) {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			setAuthNotification(null);
		}, 4000);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [authNotification]);

	useEffect(() => {
		const handleScroll = () => {
			// Make the header translucent after leaving the top of the page.
			setIsScrolled(window.scrollY > 10);
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const handleToggleSeat = (seat: Seats) => {
		setSelectedSeats((currentSeats) => {
			const isSelected = currentSeats.some(
				(currentSeat) => currentSeat.seatId === seat.seatId
			);

			if (isSelected) {
				return currentSeats.filter(
					(currentSeat) => currentSeat.seatId !== seat.seatId
				);
			}

			return [...currentSeats, seat];
		});
	};

	const totalPrice = selectedSeats.reduce((total, seat) => {
		const ticketType = seatingData?.ticketTypes.find(
			(type) => type.id === seat.ticketTypeId
		);

		return total + (ticketType?.price ?? 0);
	}, 0);


	const createOrder = async (user: UserDetails, isAuthenticatedPurchase = false) => {
		if (!eventData) {
			throw new Error('Event data is not available.');
		}

		if (selectedSeats.length === 0) {
			throw new Error('Select at least one seat.');
		}

		const order = await apiPost<CreateOrderResponse>('/order', {
			eventId: eventData.eventId,
			tickets: selectedSeats.map((seat) => ({
				ticketTypeId: seat.ticketTypeId,
				seatId: seat.seatId,
			})),
			user,
		});


		if (!order) {
			throw new Error('The order could not be created.');
		}

		setCompletedOrder(order);

		// Preserve the IDs before clearing the selected seats.
		const purchasedSeatIds = selectedSeats.map((seat) => seat.seatId);

		// Every purchased seat becomes unavailable.
		setUnavailableSeatIds((currentIds) => {
			const updatedIds = new Set(currentIds);

			purchasedSeatIds.forEach((seatId) => {
				updatedIds.add(seatId);
			});

			return updatedIds;
		});

		if (isAuthenticatedPurchase) {
			// Mark authenticated purchases as belonging to the current user.
			setMySeatIds((currentIds) => {
				const updatedIds = new Set(currentIds);

				purchasedSeatIds.forEach((seatId) => {
					updatedIds.add(seatId);
				});

				return updatedIds;
			});
		}

		setSelectedSeats([]);
		setIsCartOpen(false);
		setIsCheckoutOpen(false);
	};

	const login = async (credentials: LoginRequest) => {
		const response = await apiPost<LoginResponse>('/login', {
			email: credentials.email,
			password: credentials.password,
		});

		if (!response) {
			throw new Error('Sign in failed.');
		}

		setLoggedInUser(response.user);
		setAuthNotification('login');

		return response.user;
	};

	const handleLoginCheckout = async (credentials: LoginRequest) => {
		setIsSubmitting(true);
		setCheckoutError(null);

		try {
			const user = await login(credentials);
			// The user authenticated before creating this order.
			await createOrder(user, true);
		} catch (error) {
			// Convert the technical API error into a translated user message.
			setCheckoutError(t(getApiErrorKey(error, 'login')));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleStandaloneLogin = async (credentials: LoginRequest) => {
		setIsLoginSubmitting(true);
		setLoginError(null);

		try {
			await login(credentials);
			setIsLoginOpen(false);
		} catch (error) {
			// Convert the technical API error into a translated user message.
			setLoginError(t(getApiErrorKey(error, 'login')));
		} finally {
			setIsLoginSubmitting(false);
		}
	};

	const handleLogout = () => {
		setIsProfileOpen(false);
		setLoggedInUser(null);
		setAuthNotification('logout');
	};

	const handleGuestCheckout = async (user: UserDetails, isAuthenticatedPurchase = false) => {
		setIsSubmitting(true);
		setCheckoutError(null);

		try {
			// Forward the authentication state to the order handler.
			await createOrder(user, isAuthenticatedPurchase);
		} catch (error) {
			// Display a short translated message for order request failures.
			setCheckoutError(t(getApiErrorKey(error)));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCheckoutStart = () => {
		setCheckoutError(null);
		setCompletedOrder(null);

		if (loggedInUser) {
			// Mark seats from an authenticated checkout as belonging to this user.
			void handleGuestCheckout(loggedInUser, true);
			return;
		}

		setIsCartOpen(false);
		setIsCheckoutOpen(true);
	};


	return (
		<div className="flex grow flex-col gap-4">
			<Header
				isScrolled={isScrolled}
				selectedSeatCount={selectedSeats.length}
				loggedInUser={loggedInUser}
				avatarSrc={avatarSrc}
				onOpenCart={() => setIsCartOpen(true)}
				onOpenLogin={() => { setLoginError(null), setIsLoginOpen(true) }}
				onOpenProfile={() => setIsProfileOpen(true)}
				onLogout={handleLogout}
			/>

			<main className="flex grow flex-col justify-center">
				<div className="m-auto flex w-full max-w-screen-lg grow flex-col-reverse items-center gap-6 lg:gap-3 p-4 lg:flex-row lg:items-start">
					<div className="flex flex-col self-stretch rounded-md bg-white p-3 shadow-lg lg:grow"
						style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gridAutoRows: '40px' }}>
						{/* Stage */}
						<SeatingStage />

						{/* Only the seating rows change between loading, error and success */}
						<div className="flex w-full min-w-0 grow justify-center">
							{seatingErrorKey || eventErrorKey ? (
								<ErrorMessage message={t(seatingErrorKey ?? eventErrorKey!)} />
							) : seatingData && eventData ? (
								<SeatingMap
									seatRows={seatingData.seatRows}
									ticketTypes={seatingData.ticketTypes}
									currencyIso={eventData.currencyIso}
									selectedSeats={selectedSeats}
									unavailableSeatIds={unavailableSeatIds}
									mySeatIds={mySeatIds}
									showMySeats={loggedInUser !== null}
									onToggleSeat={handleToggleSeat}
								/>
							) : (
								<Spinner label={t('loadingSeatingData')} />
							)}
						</div>
						{/* Legend */}
						<SeatingLegend showMySeats={loggedInUser !== null} />
					</div>

					<aside className="flex flex-col self-stretch rounded-md bg-white p-3 gap-2 shadow-lg lg:grow lg:max-w-96">
						{eventErrorKey ? (
							<ErrorMessage message={t(eventErrorKey)} />
						) : eventData ? (
							<EventDetails eventData={eventData} />
						) : (
							<Spinner label={t('loadingEventData')} />
						)}
						<AddToCalendar event={eventData || undefined} />
					</aside>
				</div>
			</main >

			<Footer />

			<div className="w-full h-96 absolute -z-10 eventron-background"></div>

			{/* Notifications */}
			<div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
				<AuthNotification notification={authNotification}/>
				<OrderNotification order={completedOrder} currencyIso={eventData?.currencyIso}/>
			</div>

			<CartDialog
				open={isCartOpen}
				selectedSeats={selectedSeats}
				seatRows={seatingData?.seatRows ?? []}
				ticketTypes={seatingData?.ticketTypes ?? []}
				currencyIso={eventData?.currencyIso ?? 'CZK'}
				totalPrice={totalPrice}
				isSubmitting={isSubmitting}
				errorMessage={checkoutError}
				onClose={() => setIsCartOpen(false)}
				onRemoveSeat={handleToggleSeat}
				onCheckout={handleCheckoutStart}
			/>

			<CheckoutDialog
				open={isCheckoutOpen}
				isSubmitting={isSubmitting}
				errorMessage={checkoutError}
				onClose={() => { setCheckoutError(null), setIsCheckoutOpen(false) }}
				onGuestSubmit={handleGuestCheckout}
				onLoginSubmit={handleLoginCheckout}
			/>

			<LoginDialog
				open={isLoginOpen}
				isSubmitting={isLoginSubmitting}
				errorMessage={loginError}
				onClose={() => { setLoginError(null), setIsLoginOpen(false) }}
				onSubmit={handleStandaloneLogin}
			/>

			<ProfileDialog
				open={isProfileOpen}
				user={loggedInUser}
				avatarSrc={avatarSrc}
				onClose={() => setIsProfileOpen(false)}
			/>

			<ScrollToTopButton />
		</div >
	);
}

export default App;