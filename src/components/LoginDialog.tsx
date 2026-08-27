import { Button } from '@/components/ui/button.tsx';
import type { LoginRequest } from '@/lib/types.ts';
import { useEffect, useRef, useState, type FormEvent} from 'react';

interface LoginDialogProps {
    open: boolean;
    isSubmitting: boolean;
    errorMessage: string | null;
    onClose: () => void;
    onSubmit: (credentials: LoginRequest) => void;
}

const inputClassName = 'w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200';

export function LoginDialog({open, isSubmitting, errorMessage, onClose, onSubmit}: LoginDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    // hardcoded credentials for login
    const [credentials, setCredentials] = useState<LoginRequest>({
        email: 'frontend@nfctron.com',
        password: 'Nfctron2025',
    });

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
                        <h2 id="login-dialog-title" className="text-xl font-semibold">Sign in</h2>
                        <p className="mt-1 text-sm text-zinc-500">Sign in to your account.</p>
                    </div>

                    <Button type="button" variant="ghost" size="sm" disabled={isSubmitting} onClick={onClose}>
                        Close
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
                            Email
                        </span>

                        <input
                            className={inputClassName}
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
                            Password
                        </span>

                        <input
                            className={inputClassName}
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
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>
            </div>
        </dialog>
    );
}