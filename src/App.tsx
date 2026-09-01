import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation.ts';

import { apiGet, apiPost } from '@/lib/api.ts';
import { formatCurrency, cn } from '@/lib/utils.ts';
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

import { Button } from '@/components/ui/button.tsx';
import { CartButton } from '@/components/ui/cart-button.tsx';
import { TranslateButton } from '@/components/ui/translate-button.tsx';
import { Spinner } from '@/components/ui/spinner.tsx';
import { Logo } from '@/components/ui/logo.tsx';
import { ProfileIcon } from '@/components/ui/profile-icon.tsx';
import { LogoutIcon } from '@/components/ui/logout-icon.tsx';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button.tsx';
import { ErrorMessage } from '@/components/ui/error-message.tsx';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';

import './App.css';

type AuthNotification = 'login' | 'logout' | null;

function App() {
	const { language, t } = useTranslation();
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

	const eventDateFormatter = new Intl.DateTimeFormat(
		language === 'cs' ? 'cs-CZ' : 'en-US',
		{
			dateStyle: 'medium',
			timeStyle: 'short',
		}
	);

	return (
		<div className="flex grow flex-col gap-4">
			<header
				className={cn(
					'sticky top-0 z-40 w-full border-b border-transparent transition-all duration-300',
					isScrolled
						? 'border-zinc-200 bg-[#f7f5ff]/50 shadow-sm backdrop-blur-md'
						: 'eventron-background'
				)}
			>
				<nav className="mx-auto flex w-full max-w-screen-lg items-center justify-between gap-3 p-4" aria-label="Main navigation">
					<div className="flex w-full max-w-[250px]">
						<a href="/" className="inline-flex shrink-0 items-center" aria-label="EVENtron home">
							<Logo className="h-6 w-auto" />
						</a>
					</div>

					<div className="flex w-full max-w-[250px] items-center justify-end gap-3">
						<TranslateButton />

						<CartButton
							itemCount={selectedSeats.length}
							onClick={() => setIsCartOpen(true)}
						/>

						{loggedInUser ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										variant="link"
										size="icon"
										className="rounded-full"
										aria-label="Open user menu"
									>
										<Avatar>
											{/* default image for user profile*/}
											<AvatarImage
												src={avatarSrc}
												alt={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
												className="object-cover"
											/>
											<AvatarFallback>
												{loggedInUser.firstName.charAt(0)}
												{loggedInUser.lastName.charAt(0)}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent className="w-[200px]" align="end">
									<DropdownMenuLabel>
										<span className="block">
											{loggedInUser.firstName}{' '}
											{loggedInUser.lastName}
										</span>
									</DropdownMenuLabel>

									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										<DropdownMenuItem className="flex justify-between gap-5" onSelect={() => setIsProfileOpen(true)}>
											{t('userProfile')}
											<ProfileIcon />
										</DropdownMenuItem>

										<DropdownMenuItem className="flex justify-between gap-5" onSelect={handleLogout}>
											{t('logout')}
											<LogoutIcon />
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button
								type="button"
								variant="default"
								onClick={() => {
									setLoginError(null);
									setIsLoginOpen(true);
								}}
							>
								{t('login')}
							</Button>
						)}
					</div>
				</nav>
			</header>

			<main className="flex grow flex-col justify-center">
				<div className="m-auto flex w-full max-w-screen-lg grow flex-col-reverse items-center gap-6 lg:gap-3 p-4 lg:flex-row lg:items-start">
					<div className="flex flex-col self-stretch rounded-md bg-white p-3 shadow-lg lg:grow"
						style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gridAutoRows: '40px' }}>
						{/* Stage */}
						<SeatingStage />

						{/* Only the seating rows change between loading, error and success */}
						<div className="flex w-full min-w-0 grow justify-center">
							{seatingErrorKey || eventErrorKey ? (
								<ErrorMessage message={t(seatingErrorKey ?? eventErrorKey!)}/>
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
							<div className="flex flex-col items-start gap-2 h-full">
								<img src={eventData.headerImageUrl} className="rounded-md" alt={eventData.namePub} />
								<h1 className="text-xl font-semibold text-zinc-900">
									{eventData.namePub}
								</h1>

								<p className="text-sm text-zinc-500">
									{eventData.description}
								</p>

								<small className="text-xs text-zinc-900">
									<em>
										<strong>{t('eventStarts')}:</strong>{' '}
										<time dateTime={eventData.dateFrom}>
											{eventDateFormatter.format(new Date(eventData.dateFrom))}
										</time>
									</em>
								</small>

								<small className="text-xs text-zinc-900">
									<em>
										<strong>{t('eventEnds')}:</strong>{' '}
										<time dateTime={eventData.dateTo}>
											{eventDateFormatter.format(new Date(eventData.dateTo))}
										</time>
									</em>
								</small>

								<small className="text-xs text-zinc-900">
									<em>
										<strong>{t('venue')}:</strong>{' '}
										{eventData.place}
									</em>
								</small>

							</div>
						) : (
							<Spinner label={t('loadingEventData')} />
						)}
						<AddToCalendar event={eventData || undefined} />
					</aside>
				</div>
			</main >

			<footer className="eventron-background min-h-40">
				<div className="mx-auto flex w-full max-w-screen-lg flex-col gap-6 p-6">
					<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<Logo className="h-4 w-auto" />

						<p className="w-1/2 w-full:sm text-xs text-zinc-500">
							{t('footerIntroduction')}{' '}
							<a href="https://www.nfctron.com/" target="_blank" rel="noreferrer" className="text-violet-600 hover:text-violet-700 hover:underline">
								NFCtron
							</a>
							. {t('footerDisclaimer')}
						</p>
					</div>

					<div className="flex flex-col justify-between gap-2 border-t border-zinc-200 pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center">
						<p>
							&copy; {new Date().getFullYear()}{' '}
							<a href="https://nazar-portfolio-react.vercel.app/" target="_blank" rel="noreferrer" className="text-violet-600 hover:text-violet-700 hover:underline">
								Nazar Pichak
							</a>
							. {t('allRightsReserved')}
						</p>

						<p>
							{t('builtWith')}{' '}
							<a href="https://react.dev/" target="_blank" rel="noreferrer" className="text-violet-600 hover:text-violet-700 hover:underline">
								React
							</a>
							,{' '}
							<a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer" className="text-violet-600 hover:text-violet-700 hover:underline">
								TypeScript
							</a>{' '}
							{t('and')}{' '}
							<a href="https://tailwindcss.com/" target="_blank" rel="noreferrer" className="text-violet-600 hover:text-violet-700 hover:underline">
								Tailwind CSS
							</a>
						</p>
					</div>
				</div>
			</footer>

			<div className="w-full h-96 absolute -z-10 eventron-background"></div>

			<div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">

				{authNotification && (
					<div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800 shadow-lg" role="status" aria-live="polite">
						<p className="text-sm">{authNotification === 'login' ? t('loginSuccessful') : t('logoutSuccessful')}</p>
					</div>
				)}

				{completedOrder && (
					<div
						className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800 shadow-lg"
						role="status"
						aria-live="polite"
					>
						<p className="font-semibold">{t('orderCreated')}</p>
						<p className="mt-1 text-sm">{t('orderId')}: {completedOrder.orderId}</p>
						<p className="text-sm">{completedOrder.message}</p>
						<p className="mt-2 text-sm font-semibold">
							{t('total')}:{' '}
							{eventData ? formatCurrency(completedOrder.totalAmount, eventData.currencyIso, language) : completedOrder.totalAmount}
						</p>
					</div>
				)}
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
