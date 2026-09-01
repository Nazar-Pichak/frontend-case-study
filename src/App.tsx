import { useState } from 'react';
import { useCart } from '@/hooks/useCart.ts';
import { useScrollState } from '@/hooks/useScrollState.ts';
import { useEventData } from '@/hooks/useEventData.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { useCheckout } from '@/hooks/useCheckout.ts';

import { Header } from '@/components/layout/Header.tsx';
import { Footer } from '@/components/layout/Footer.tsx';
import { CartDialog } from '@/components/cart/CartDialog.tsx';
import { CheckoutDialog } from '@/components/checkout/CheckoutDialog.tsx';
import { LoginDialog } from '@/components/auth/LoginDialog.tsx';
import { ProfileDialog } from '@/components/auth/ProfileDialog.tsx';
import { AuthNotification } from '@/components/notifications/AuthNotification.tsx';
import { OrderNotification } from '@/components/notifications/OrderNotification.tsx';
import { EventSection } from '@/components/event/EventSection.tsx';
import { SeatingSection } from '@/components/seating/SeatingSection.tsx';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button.tsx';

import type { LoginRequest, UserDetails } from '@/lib/types.ts';

import './App.css';

type AuthNotification = 'login' | 'logout' | null;

function App() {

	const { eventData, seatingData, eventErrorKey, seatingErrorKey } = useEventData();
	const { selectedSeats, totalPrice, toggleSeat: handleToggleSeat, clearCart } = useCart(seatingData?.ticketTypes ?? []);
	const { loggedInUser, authNotification, loginError, isLoginSubmitting, authenticate, submitLogin, logout, clearLoginError } = useAuth();
	const {
		completedOrder,
		checkoutError,
		isSubmitting,
		unavailableSeatIds,
		mySeatIds,
		submitCheckout,
		submitLoginCheckout,
		resetCheckoutFeedback,
		clearCheckoutError,
	} = useCheckout({ eventData, selectedSeats, clearCart, authenticate });

	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const isScrolled = useScrollState();

	const avatarSrc = "/ian-dooley-d1UPkiFd04A-unsplash.jpg";

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

	const handleLoginCheckout = async (credentials: LoginRequest) => {
		const wasSuccessful = await submitLoginCheckout(credentials);

		if (wasSuccessful) {
			setIsCartOpen(false);
			setIsCheckoutOpen(false);
		}
	};

	const handleGuestCheckout = async (user: UserDetails, isAuthenticatedPurchase = false) => {
		const wasSuccessful = await submitCheckout(user, isAuthenticatedPurchase);

		// Dialog visibility remains in App because it is UI state.
		if (wasSuccessful) {
			setIsCartOpen(false);
			setIsCheckoutOpen(false);
		}
	};

	const handleCheckoutStart = () => {
		resetCheckoutFeedback();

		if (loggedInUser) {
			// Authenticated purchases are displayed as belonging
			// to the currently signed-in user.
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
					clearCheckoutError();
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