import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation.ts';

import { apiGet, apiPost } from '@/lib/api.ts';
import { formatCurrency } from '@/lib/utils.ts';
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

import { Button } from '@/components/ui/button.tsx';
import { CartButton } from '@/components/ui/cart-button.tsx';
import { TranslateButton } from '@/components/ui/translate-button.tsx';
import { Spinner } from '@/components/ui/spinner.tsx';
import { Logo } from '@/components/ui/logo.tsx';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button.tsx';
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

	const avatarSrc = "/ian-dooley-d1UPkiFd04A-unsplash.jpg"
	const eventId = eventData?.eventId;

	useEffect(() => {
		const fetchEventData = async (): Promise<void> => {
			try {
				const response = await apiGet<EventData>('/event');

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
				const response = await apiGet<SeatingData>(
					`/event-tickets?eventId=${eventId}`
				);

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

		setUnavailableSeatIds((currentIds) => {
			const updatedIds = new Set(currentIds);
			selectedSeats.forEach((seat) => { updatedIds.add(seat.seatId) });
			return updatedIds;
		});

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
			await createOrder(user);
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
			await login(credentials);
			setIsLoginOpen(false);
		} catch (error) {
			setLoginError(getErrorMessage(error));
		} finally {
			setIsLoginSubmitting(false);
		}
	};

	const handleLogout = () => {
		setIsProfileOpen(false);
		setLoggedInUser(null);
		setAuthNotification('logout');
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

	const handleCheckoutStart = () => {
		setCheckoutError(null);
		setCompletedOrder(null);

		if (loggedInUser) {
			void handleGuestCheckout(loggedInUser);
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
			<nav className="sticky left-0 right-0 top-0 flex justify-center eventron-background">
				<div className="flex max-w-screen-lg grow items-center justify-between gap-3 p-4">
					<div className="flex w-full max-w-[250px]">
						<a href="/" className="inline-flex shrink-0 items-center" aria-label="EVENtron home">
							<Logo className="h-6 w-auto" />
						</a>
					</div>

					<div className="flex w-full max-w-[250px] items-center justify-end gap-3">
						<TranslateButton></TranslateButton>
						<CartButton itemCount={selectedSeats.length} onClick={() => setIsCartOpen(true)} />

						{loggedInUser ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="Open user menu">
										<Avatar>
											<AvatarImage src={avatarSrc} alt={`${loggedInUser.firstName} ${loggedInUser.lastName}`} className="object-cover" />
											<AvatarFallback>
												{loggedInUser.firstName.charAt(0)}
												{loggedInUser.lastName.charAt(0)}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent className="w-[250px]" align="end">
									<DropdownMenuLabel>
										<span className="block">
											{loggedInUser.firstName}{' '}
											{loggedInUser.lastName}
										</span>

										<span className="block truncate text-xs font-normal text-zinc-500">
											{loggedInUser.email}
										</span>
									</DropdownMenuLabel>

									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										<DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
											{t('userProfile')}
										</DropdownMenuItem>

										<DropdownMenuItem onSelect={handleLogout}>
											{t('logout')}
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button type="button" variant="default" onClick={() => { setLoginError(null), setIsLoginOpen(true) }}>
								{t('login')}
							</Button>
						)}
					</div>
				</div>
			</nav>

			<main className="flex grow flex-col justify-center">
				<div className="m-auto flex w-full max-w-screen-lg grow flex-col-reverse items-center gap-3 p-4 lg:flex-row lg:items-start">
					<div
						className="self-stretch overflow-x-auto overflow-y-auto rounded-md bg-white p-3 shadow-sm lg:grow"
						style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gridAutoRows: '40px' }}
					>
						{seatingData ? (
							<SeatingMap
								seatRows={seatingData.seatRows}
								ticketTypes={seatingData.ticketTypes}
								selectedSeats={selectedSeats}
								unavailableSeatIds={unavailableSeatIds}
								currencyIso={eventData?.currencyIso ?? 'CZK'}
								onToggleSeat={handleToggleSeat}
							/>
						) : (
							<Spinner label={t('loadingSeatingData')} />
						)}
					</div>

					<aside className="flex w-full lg:max-w-96 flex-col gap-2 rounded-md bg-white p-3 shadow-sm">
						{eventData ? (
							<>
								<div className="rounded-md bg-zinc-100 h-96 w-full sm:h-60"
									style={{
										backgroundImage: `url(${eventData.headerImageUrl})`,
										backgroundPosition: 'center',
										backgroundSize: 'cover',
									}}
								/>

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

								<AddToCalendar event={eventData} />
							</>
						) : (
							<Spinner label={t('loadingEventData')} />
						)}
					</aside>
				</div>
			</main>

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
		</div>
	);
}

export default App;
