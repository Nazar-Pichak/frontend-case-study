import { useTranslation } from '@/hooks/useTranslation.ts';

export type AuthNotificationType = 'login' | 'logout';

interface AuthNotificationProps { notification: AuthNotificationType | null }

export function AuthNotification({ notification }: AuthNotificationProps) {
    const { t } = useTranslation();

    if (!notification) {
        return null;
    }

    return (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800 shadow-lg" role="status" aria-live="polite">
            <p className="text-sm">{notification === 'login' ? t('loginSuccessful') : t('logoutSuccessful')}</p>
        </div>
    );
}