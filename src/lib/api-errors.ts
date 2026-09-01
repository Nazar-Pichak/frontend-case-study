import type { TranslationKey } from '@/lib/i18n.ts';

export type ErrorContext = 'general' | 'login';

export class ApiError extends Error {
	status: number;

	constructor(status: number, statusText: string) {
		super(`Error: ${status} ${statusText}. Try again later.`);
		this.name = 'ApiError';
		this.status = status;
	}
}

export function getApiErrorKey(error: unknown, context: ErrorContext = 'general'): TranslationKey {
	// Fetch uses TypeError when the server cannot be reached.
	if (error instanceof TypeError) {
		return 'networkError';
	}

	if (!(error instanceof ApiError)) {
		return 'unexpectedError';
	}

	if (error.status === 401 && context === 'login') {
		return 'invalidCredentials';
	}

	if (error.status >= 400 && error.status < 500) {
		return 'requestError';
	}

	if (error.status === 504) {
		return 'gatewayTimeout';
	}

	if (error.status >= 500) {
		return 'serviceUnavailable';
	}

	return 'unexpectedError';
}