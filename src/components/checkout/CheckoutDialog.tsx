import { Button } from '@/components/ui/button.tsx';
import type { LoginRequest, UserDetails } from '@/lib/types.ts';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from '@/hooks/useTranslation.ts';

import { TEST_CREDENTIALS } from '@/lib/test-credentials.ts';

type CheckoutMode = 'choice' | 'guest' | 'login';
interface CheckoutDialogProps {
    open: boolean;
    isSubmitting: boolean;
    errorMessage: string | null;
    onClose: () => void;
    onGuestSubmit: (user: UserDetails) => void;
    onLoginSubmit: (credentials: LoginRequest) => void;
}

const inputClassName = 'w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200';

export function CheckoutDialog({
    open,
    isSubmitting,
    errorMessage,
    onClose,
    onGuestSubmit,
    onLoginSubmit,
}: CheckoutDialogProps) {
    const { t } = useTranslation();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [mode, setMode] = useState<CheckoutMode>('choice');
    const [guest, setGuest] = useState<UserDetails>({ email: '', firstName: '', lastName: '' });
    const [credentials, setCredentials] = useState<LoginRequest>({...TEST_CREDENTIALS});

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (open && !dialog.open) {
            setMode('choice');
            dialog.showModal();
        }

        if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    const handleGuestSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onGuestSubmit(guest);
    };

    const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onLoginSubmit(credentials);
    };

    return (
        <dialog ref={dialogRef}
            className="w-[calc(100%-2rem)] max-w-md rounded-lg bg-white p-0 shadow-xl backdrop:bg-black/40"
            aria-labelledby="checkout-dialog-title"
            onCancel={(event) => {
                event.preventDefault();

                if (!isSubmitting) {
                    onClose();
                }
            }}
        >
            <div className="p-6">
                <header className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 id="checkout-dialog-title" className="text-xl font-semibold">{t('checkout')}</h2>
                        <p className="mt-1 text-sm text-zinc-500">{t('chooseCheckoutMethod')}</p>
                    </div>

                    <Button type="button" variant="outline" size="sm" disabled={isSubmitting} onClick={onClose} aria-label="Close checkout">
                        {t('close')}
                    </Button>
                </header>

                {errorMessage && (
                    <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                        {errorMessage}
                    </p>
                )}

                {mode === 'choice' && (
                    <div className="flex flex-col gap-3">
                        <Button type="button" onClick={() => setMode('guest')}>
                            {t('continueAsGuest')}
                        </Button>

                        <Button type="button" variant="outline" onClick={() => setMode('login')}>
                            {t('signIn')}
                        </Button>
                    </div>
                )}

                {mode === 'guest' && (
                    <form className="flex flex-col gap-4" onSubmit={handleGuestSubmit}>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium">
                                {t('firstName')}
                            </span>

                            <input
                                className={inputClassName}
                                type="text"
                                autoComplete="given-name"
                                required
                                value={guest.firstName}
                                onChange={(event) =>
                                    setGuest((currentGuest) => ({
                                        ...currentGuest,
                                        firstName: event.target.value,
                                    }))
                                }
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium">
                                {t('lastName')}
                            </span>

                            <input
                                className={inputClassName}
                                type="text"
                                autoComplete="family-name"
                                required
                                value={guest.lastName}
                                onChange={(event) =>
                                    setGuest((currentGuest) => ({
                                        ...currentGuest,
                                        lastName: event.target.value,
                                    }))
                                }
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium">
                                {t('email')}
                            </span>

                            <input
                                className={inputClassName}
                                type="email"
                                autoComplete="email"
                                required
                                value={guest.email}
                                onChange={(event) =>
                                    setGuest((currentGuest) => ({
                                        ...currentGuest,
                                        email: event.target.value,
                                    }))
                                }
                            />
                        </label>

                        <div className="mt-2 flex gap-3">
                            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setMode('choice')}>
                                {t('back')}
                            </Button>

                            <Button type="submit" disabled={isSubmitting} className="flex-1">
                                {isSubmitting ? t('creatingOrder') : t('createOrder')}
                            </Button>
                        </div>
                    </form>
                )}

                {mode === 'login' && (
                    <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium">
                                {t('email')}
                            </span>

                            <input
                                className={inputClassName}
                                type="email"
                                autoComplete="email"
                                required
                                value={credentials.email}
                                onChange={(event) =>
                                    setCredentials(
                                        (currentCredentials) => ({
                                            ...currentCredentials,
                                            email: event.target.value,
                                        })
                                    )
                                }
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium">
                                {t('password')}
                            </span>

                            <input
                                className={inputClassName}
                                type="password"
                                autoComplete="current-password"
                                required
                                value={credentials.password}
                                onChange={(event) =>
                                    setCredentials(
                                        (currentCredentials) => ({
                                            ...currentCredentials,
                                            password: event.target.value,
                                        })
                                    )
                                }
                            />
                        </label>

                        <div className="mt-2 flex gap-3">
                            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setMode('choice')}>
                                {t('back')}
                            </Button>

                            <Button type="submit" disabled={isSubmitting} className="flex-1">
                                {isSubmitting ? t('signingIn') : t('signInAndContinue')}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </dialog>
    );
}