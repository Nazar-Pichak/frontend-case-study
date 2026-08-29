import { Button } from '@/components/ui/button.tsx';
import { createGoogleCalendarUrl, downloadCalendarEvent } from '@/lib/calendar.ts';
import { useTranslation } from '@/hooks/useTranslation.ts';
import type { EventData } from '@/lib/types.ts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';

interface AddToCalendarProps {event: EventData}

export function AddToCalendar({event}: AddToCalendarProps) {
    const { t } = useTranslation();
    const handleGoogleCalendar = () => {
        window.open(createGoogleCalendarUrl(event), '_blank', 'noopener,noreferrer');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="default" className="ml-auto" >
                    {t('addToCalendar')}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleGoogleCalendar}>
                    {t('googleCalendar')}
                </DropdownMenuItem>
                {/* downloadable file for opening in other calendars */}
                <DropdownMenuItem onSelect={() => downloadCalendarEvent(event)}>
                    {t('downloadCalendarFile')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}