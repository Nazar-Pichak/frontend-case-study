import { Spinner } from '@/components/ui/spinner.tsx';
import { useTranslation } from '@/hooks/useTranslation.ts';
import { ErrorMessage } from '@/components/ui/error-message.tsx';
import { EventDetails } from '@/components/event/EventDetails.tsx';
import { AddToCalendar } from '@/components/event/AddToCalendar.tsx';

import type { TranslationKey } from '@/lib/i18n.ts';
import type { EventData } from '@/lib/types.ts';

interface EventSectionProps {
    event: EventData | null;
    errorKey: TranslationKey | null;
}

export function EventSection({ event, errorKey }: EventSectionProps) {
    const { t } = useTranslation();

    return (
        <aside className="flex flex-col self-stretch rounded-md bg-white p-3 gap-2 shadow-lg lg:grow lg:max-w-96">
            {errorKey ? (
                <ErrorMessage message={t(errorKey)} />
            ) : event ? (
                <EventDetails eventData={event} />
            ) : (
                <Spinner label={t('loadingEventData')} />
            )}
            {/* Keep the action visible but disabled until event data is available. */}
            <AddToCalendar event={event || undefined} />
        </aside>
    );
}