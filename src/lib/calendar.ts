import type { EventData } from '@/lib/types.ts';

function formatCalendarDate(date: string) {
    return new Date(date)
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');
}

function escapeCalendarText(value: string) {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/,/g, '\\,')
        .replace(/;/g, '\\;');
}

export function createGoogleCalendarUrl(event: EventData) {
    const parameters = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.namePub,
        dates: `${formatCalendarDate(
            event.dateFrom
        )}/${formatCalendarDate(event.dateTo)}`,
        details: event.description,
        location: event.place,
    });

    return `https://calendar.google.com/calendar/render?${parameters.toString()}`;
}

export function downloadCalendarEvent(event: EventData) {
    const calendarContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Frontend Case Study//Event Calendar//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:${event.eventId}@frontend-case-study`,
        `DTSTAMP:${formatCalendarDate(new Date().toISOString())}`,
        `DTSTART:${formatCalendarDate(event.dateFrom)}`,
        `DTEND:${formatCalendarDate(event.dateTo)}`,
        `SUMMARY:${escapeCalendarText(event.namePub)}`,
        `DESCRIPTION:${escapeCalendarText(event.description)}`,
        `LOCATION:${escapeCalendarText(event.place)}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');

    const calendarFile = new Blob([calendarContent], {
        type: 'text/calendar;charset=utf-8',
    });

    const fileUrl = URL.createObjectURL(calendarFile);
    const link = document.createElement('a');

    link.href = fileUrl;
    link.download = `${event.namePub
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}-event.ics`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
}