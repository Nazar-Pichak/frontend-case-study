import { useTranslation } from '@/hooks/useTranslation.ts';

import { Button } from '@/components/ui/button.tsx';
import { CalendarIcon } from '@/components/ui/calendar-icon.tsx';
import { google, outlook, office365, yahoo, ics } from 'calendar-link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx';

import type { EventData } from '@/lib/types.ts';
interface AddToCalendarProps {
    event?: EventData;
    disabled?: boolean;
}

export function AddToCalendar({ event, disabled = false }: AddToCalendarProps) {
    const { t } = useTranslation();

    const calendarEvent = event ? {
        uid: event.eventId,
        title: event.namePub,
        description: event.description,
        start: event.dateFrom,
        end: event.dateTo,
        location: event.place,
    } : null;

    const googleUrl = calendarEvent ? google(calendarEvent) : null;
    const outlookUrl = calendarEvent ? outlook(calendarEvent) : null;
    const office365Url = calendarEvent ? office365(calendarEvent) : null;
    const yahooUrl = calendarEvent ? yahoo(calendarEvent) : null;
    const calendarFileUrl = calendarEvent ? ics(calendarEvent) : null;

    const handleCalendar = (url: string | null) => {
        if (!url) {
            return;
        }
        window.open(
            url,
            '_blank',
            'noopener,noreferrer'
        );
    };

    const handleDownloadCalendar = (url: string | null) => {
        if (!url || !event) {
            return;
        }
        // Create a temporary link to start the browser download.
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `${event.namePub
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')}.ics`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
    };


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="default" className="ml-auto mt-auto" disabled={disabled || !event}>
                    {t('addToCalendar')}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex justify-between gap-5" onSelect={() => handleCalendar(googleUrl)}>
                    {t('googleCalendar')}
                    <CalendarIcon provider="google" />
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between gap-5" onSelect={() => handleCalendar(outlookUrl)}>
                    {t('outlookCalendar')}
                    <CalendarIcon provider="outlook" />
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between gap-5" onSelect={() => handleCalendar(office365Url)}>
                    {t('office365Calendar')}
                    <CalendarIcon provider="microsoft" />
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between gap-5" onSelect={() => handleCalendar(yahooUrl)}>
                    {t('yahooCalendar')}
                    <CalendarIcon provider="yahoo" />
                </DropdownMenuItem>
                {/* downloadable file for opening in other calendars (Apple Calendar, Outlook desktop, Thunderbird ...) */}
                <DropdownMenuItem className="flex justify-between gap-5" onSelect={() => handleDownloadCalendar(calendarFileUrl)}>
                    {t('downloadCalendarFile')}
                    <CalendarIcon provider="download" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}