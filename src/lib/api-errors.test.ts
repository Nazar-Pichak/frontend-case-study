import { describe, expect, it } from 'vitest';
import { ApiError, getApiErrorKey } from '@/lib/api-errors.ts';

describe('getApiErrorKey', () => {
	it('maps a fetch failure to a network error', () => {
		const error = new TypeError('Failed to fetch');

		expect(getApiErrorKey(error)).toBe(
			'networkError'
		);
	});

	it('maps a login 401 response to invalid credentials', () => {
		const error = new ApiError(
			401,
			'Unauthorized'
		);

		expect(
			getApiErrorKey(error, 'login')
		).toBe('invalidCredentials');
	});

	it('maps another client response to a request error', () => {
		const error = new ApiError(
			403,
			'Forbidden'
		);

		expect(getApiErrorKey(error)).toBe(
			'requestError'
		);
	});

	it('maps a 504 response to a gateway timeout', () => {
		const error = new ApiError(
			504,
			'Gateway Timeout'
		);

		expect(getApiErrorKey(error)).toBe(
			'gatewayTimeout'
		);
	});

	it('maps another server response to service unavailable', () => {
		const error = new ApiError(
			503,
			'Service Unavailable'
		);

		expect(getApiErrorKey(error)).toBe(
			'serviceUnavailable'
		);
	});

	it('maps an unknown error to the fallback message', () => {
		const error = new Error(
			'Unexpected application error'
		);

		expect(getApiErrorKey(error)).toBe(
			'unexpectedError'
		);
	});
});