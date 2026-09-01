import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api.ts';
import { getApiErrorKey } from '@/lib/api-errors.ts';
import type { TranslationKey } from '@/lib/i18n.ts';
import type { EventData, SeatingData} from '@/lib/types.ts';

interface UseEventDataResult {
	eventData: EventData | null;
	seatingData: SeatingData | null;
	eventErrorKey: TranslationKey | null;
	seatingErrorKey: TranslationKey | null;
}

export function useEventData(): UseEventDataResult {
	// Store the two related API resources separately because seating data
	// cannot be requested until the event endpoint provides an eventId.
	const [eventData, setEventData] = useState<EventData | null>(null);
	const [seatingData, setSeatingData] = useState<SeatingData | null>(null);

	// Store translation keys instead of fixed messages so the UI
	// can display every API error in the currently selected language.
	const [eventErrorKey, setEventErrorKey] = useState<TranslationKey | null>(null);
	const [seatingErrorKey, setSeatingErrorKey] = useState<TranslationKey | null>(null);

	const eventId = eventData?.eventId;

	useEffect(() => {
		// The request cannot currently be aborted through apiGet,
		// so this flag prevents a completed request from updating state
		// after the component using the hook has been unmounted.
		let isActive = true;

		const fetchEventData = async (): Promise<void> => {
			setEventErrorKey(null);

			try {
				const response = await apiGet<EventData>('/event');

				if (!isActive) {
					return;
				}

				// apiGet currently allows undefined in its return type,
				// so handle an empty response as an unexpected API failure.
				if (!response) {
					setEventErrorKey('unexpectedError');
					return;
				}

				setEventData(response);
			} catch (error: unknown) {
				if (!isActive) {
					return;
				}

				// Keep the original technical error available
				// for development and production diagnostics.
				console.error('Failed to load event:', error);

				// Convert the technical error into a short,
				// localized message key suitable for the UI.
				setEventErrorKey(getApiErrorKey(error));
			}
		};

		void fetchEventData();
		return () => {isActive = false};

	}, []);

	useEffect(() => {
	// Seating data depends on the event identifier returned
	// by the first request, so do not call the endpoint early.
        if (!eventId) {
            return;
        }

        // Ignore a response belonging to an obsolete eventId
        // or to a component that has already been unmounted.
        let isActive = true;

        const fetchSeatingData =
            async (): Promise<void> => {
                setSeatingErrorKey(null);

                try {
                    const response = await apiGet<SeatingData>('/event-tickets', { eventId });

                    if (!isActive) {
                        return;
                    }

                    if (!response) {
                        setSeatingErrorKey('unexpectedError');
                        return;
                    }

                    setSeatingData(response);
                } catch (error: unknown) {
                    if (!isActive) {
                        return;
                    }

                    // Keep technical details in the console
                    // while showing a localized message in the UI.
                    console.error( 'Failed to load seating data:', error);

                    setSeatingErrorKey(
                        getApiErrorKey(error)
                    );
                }
            };

        void fetchSeatingData();

        return () => {isActive = false};
    }, [eventId]);

	return {
		eventData,
		seatingData,
		eventErrorKey,
		seatingErrorKey,
	};
}