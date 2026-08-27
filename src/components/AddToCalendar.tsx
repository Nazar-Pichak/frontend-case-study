import { Button } from '@/components/ui/button.tsx';
import { createGoogleCalendarUrl, downloadCalendarEvent } from '@/lib/calendar.ts';
import type { EventData } from '@/lib/types.ts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';

interface AddToCalendarProps {event: EventData}

export function AddToCalendar({event}: AddToCalendarProps) {
    const handleGoogleCalendar = () => {
        window.open(createGoogleCalendarUrl(event), '_blank', 'noopener,noreferrer');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="default">
                    Add to calendar
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleGoogleCalendar}>
                    Google Calendar
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => downloadCalendarEvent(event)}>
                    Download calendar file
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}