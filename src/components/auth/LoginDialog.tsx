import { useTranslation } from '@/hooks/useTranslation.ts';
import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button.tsx';

import type { LoginRequest } from '@/lib/types.ts';

import { TEST_CREDENTIALS } from '@/lib/test-credentials';

interface LoginDialogProps {
    open: boolean;
    isSubmitting: boolean;
    errorMessage: string | null;
    onClose: () => void;
    onSubmit: (credentials: LoginRequest) => void;
}

export function LoginDialog({open, isSubmitting, errorMessage, onClose, onSubmit}: LoginDialogProps) {
    const { t } = useTranslation();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [credentials, setCredentials] = useState<LoginRequest>({...TEST_CREDENTIALS});

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (open && !dialog.open) {
            dialog.showModal();
        }

        if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(credentials);
    };

    return (
        <dialog
            ref={dialogRef}
            className="w-[calc(100%-2rem)] max-w-md rounded-lg bg-white p-0 shadow-xl backdrop:bg-black/40"
            aria-labelledby="login-dialog-title"
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
                        <h2 id="login-dialog-title" className="text-xl font-semibold">{t('signIn')}</h2>
                        <p className="mt-1 text-sm text-zinc-500">{t('signInToAccount')}.</p>
                    </div>

                    <Button type="button" variant="outline" size="sm" disabled={isSubmitting} onClick={onClose}>
                        {t('close')}
                    </Button>
                </header>

                {errorMessage && (
                    <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                        {errorMessage}
                    </p>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                            {t('email')}
                        </span>

                        <input
                            className="eventron-input"
                            type="email"
                            autoComplete="email"
                            required
                            value={credentials.email}
                            onChange={(event) =>
                                setCredentials((current) => ({
                                    ...current,
                                    email: event.target.value,
                                }))
                            }
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                            {t('password')}
                        </span>

                        <input
                            className="eventron-input"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={credentials.password}
                            onChange={(event) =>
                                setCredentials((current) => ({
                                    ...current,
                                    password: event.target.value,
                                }))
                            }
                        />
                    </label>

                    <Button type="submit" disabled={isSubmitting} className="mt-2">
                        {isSubmitting ? t('signingIn') : t('signIn')}
                    </Button>
                </form>
            </div>
        </dialog>
    );
}