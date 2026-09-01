import { useTranslation } from '@/hooks/useTranslation.ts';
import type { EventData } from '@/lib/types.ts';

interface EventDetailsProps {
    eventData: EventData;
}

export function EventDetails({ eventData }: EventDetailsProps) {
    const { language, t } = useTranslation();

    // Format the event date and time according to the selected language.
    const eventDateFormatter = new Intl.DateTimeFormat(
        // Use the regional locale to display dates in the expected local format.
        language === 'cs' ? 'cs-CZ' : 'en-US',
        {
            dateStyle: 'medium',
            timeStyle: 'short',
        }
    );

    return (
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
    );
}