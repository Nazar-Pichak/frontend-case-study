import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import type { UserDetails } from '@/lib/types.ts';
import { useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation.ts';

interface ProfileDialogProps {
    open: boolean;
    user: UserDetails | null;
    avatarSrc: string;
    onClose: () => void;
}

export function ProfileDialog({open, user, avatarSrc, onClose}: ProfileDialogProps) {
    const { t } = useTranslation();
    const dialogRef = useRef<HTMLDialogElement>(null);

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

    if (!user) {
        return null;
    }

    return (
        <dialog
            ref={dialogRef}
            className="w-[calc(100%-2rem)] max-w-md rounded-lg bg-white p-0 shadow-xl backdrop:bg-black/40"
            aria-labelledby="profile-dialog-title"
            onCancel={(event) => {event.preventDefault(), onClose()}}
        >
            <div className="p-6">
                <header className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={onClose}>
                        {t('close')}
                    </Button>
                </header>

                <div className="flex flex-col items-center text-center">
                    <Avatar className="size-28">
                        <AvatarImage src={avatarSrc} alt={`${user.firstName} ${user.lastName}`} className="object-cover"/>

                        <AvatarFallback className="text-2xl">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <h2 id="profile-dialog-title" className="mt-4 text-2xl font-semibold">
                        {user.firstName} {user.lastName}
                    </h2>

                </div>

                <dl className="mt-6 divide-y divide-zinc-200 rounded-md border border-zinc-200">
                    <div className="flex justify-between gap-4 p-3">
                        <dt className="text-sm text-zinc-500">{t('firstName')}</dt>
                        <dd className="text-sm font-medium">{user.firstName}</dd>
                    </div>

                    <div className="flex justify-between gap-4 p-3">
                        <dt className="text-sm text-zinc-500">{t('lastName')}</dt>
                        <dd className="text-sm font-medium">{user.lastName}</dd>
                    </div>

                    <div className="flex justify-between gap-4 p-3">
                        <dt className="text-sm text-zinc-500">{t('email')}</dt>
                        <dd className="break-all text-right text-sm font-medium">{user.email}</dd>
                    </div>
                </dl>
            </div>
        </dialog>
    );
}