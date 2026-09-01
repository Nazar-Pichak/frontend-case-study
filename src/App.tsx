import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation.ts';
import { useCart } from '@/hooks/useCart.ts';
import { useScrollState } from '@/hooks/useScrollState.ts';
import { useEventData } from '@/hooks/useEventData.ts';
import { useAuth } from '@/hooks/useAuth.ts';

import { apiPost } from '@/lib/api.ts';
import { getApiErrorKey } from '@/lib/api-errors.ts';
import type { CreateOrderResponse, LoginRequest, UserDetails } from '@/lib/types.ts';

import { CartDialog } from '@/components/cart/CartDialog.tsx';
import { CheckoutDialog } from '@/components/checkout/CheckoutDialog.tsx';
import { LoginDialog } from '@/components/auth/LoginDialog.tsx';
import { ProfileDialog } from '@/components/auth/ProfileDialog.tsx';

// refactor
import { Header } from '@/components/layout/Header.tsx';
import { Footer } from '@/components/layout/Footer.tsx';
import { AuthNotification } from '@/components/notifications/AuthNotification.tsx';
import { OrderNotification } from '@/components/notifications/OrderNotification.tsx';
import { EventSection } from '@/components/event/EventSection.tsx';
import { SeatingSection } from '@/components/seating/SeatingSection.tsx';

import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button.tsx';

import './App.css';

type AuthNotification = 'login' | 'logout' | null;

function App() {
	const { t } = useTranslation();
	const { eventData, seatingData, eventErrorKey, seatingErrorKey } = useEventData();
	const { selectedSeats, totalPrice, toggleSeat: handleToggleSeat, clearCart } = useCart(seatingData?.ticketTypes ?? []);
	const { loggedInUser, authNotification, loginError, isLoginSubmitting, authenticate, submitLogin, logout, clearLoginError } = useAuth();
	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [checkoutError, setCheckoutError] = useState<string | null>(null);
	const [completedOrder, setCompletedOrder] = useState<CreateOrderResponse | null>(null);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [unavailableSeatIds, setUnavailableSeatIds] = useState<Set<string>>(() => new Set());
	const [mySeatIds, setMySeatIds] = useState<Set<string>>(() => new Set());
	const isScrolled = useScrollState();

	const avatarSrc = "/ian-dooley-d1UPkiFd04A-unsplash.jpg";

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

		clearCart();
		setIsCartOpen(false);
		setIsCheckoutOpen(false);
	};


	const handleLoginCheckout = async (credentials: LoginRequest) => {
		setIsSubmitting(true);
		setCheckoutError(null);

		try {
			const user = await authenticate(credentials);
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
		const user = await submitLogin(credentials);

		// Keep dialog visibility in App because it is presentation state,
		// not part of the authentication session.
		if (user) {
			setIsLoginOpen(false);
		}
	};

	const handleLogout = () => {
		setIsProfileOpen(false);
		logout();
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
				onOpenLogin={() => {
					clearLoginError();
					setIsLoginOpen(true);
				}}
				onOpenProfile={() => setIsProfileOpen(true)}
				onLogout={handleLogout}
			/>

			<main className="flex grow flex-col justify-center">
				<div className="m-auto flex w-full max-w-screen-lg grow flex-col-reverse items-center gap-6 lg:gap-3 p-4 lg:flex-row lg:items-start">
					<SeatingSection
						seatingData={seatingData}
						currencyIso={eventData?.currencyIso ?? null}
						errorKey={seatingErrorKey ?? eventErrorKey}
						selectedSeats={selectedSeats}
						unavailableSeatIds={unavailableSeatIds}
						mySeatIds={mySeatIds}
						showMySeats={loggedInUser !== null}
						onToggleSeat={handleToggleSeat}
					/>
					<EventSection event={eventData} errorKey={eventErrorKey} />
				</div>
			</main >

			<Footer />

			<div className="w-full h-96 absolute -z-10 eventron-background"></div>

			{/* Notifications */}
			<div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
				<AuthNotification notification={authNotification} />
				<OrderNotification order={completedOrder} currencyIso={eventData?.currencyIso} />
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
				onClose={() => {
					setCheckoutError(null);
					setIsCheckoutOpen(false);
				}}
				onGuestSubmit={handleGuestCheckout}
				onLoginSubmit={handleLoginCheckout}
			/>

			<LoginDialog
				open={isLoginOpen}
				isSubmitting={isLoginSubmitting}
				errorMessage={loginError}
				onClose={() => {
					clearLoginError();
					setIsLoginOpen(false);
				}}
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