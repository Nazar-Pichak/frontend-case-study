// This file contains utility functions for making API requests to the backend server.
// It provides functions for GET, POST, PUT, and DELETE requests, handling JSON data and error responses appropriately.

import { ApiError } from '@/lib/api-errors.ts';
import type { FetchData, ApiGet, ApiPost, ApiPut, ApiDelete } from '@/lib/types.ts';

// Route requests through a same-origin proxy in both development
// and production to avoid browser CORS restrictions.
const API_BASE_URL = '/api';

// HTTP status codes that usually indicate a temporary server or gateway issue.
const RETRYABLE_STATUS_CODES = new Set([502, 503, 504]);

// A GET request can safely be retried because it does not modify server data.
const GET_RETRY_COUNT = 2;
const RETRY_DELAY_MS = 750;

// Pause before the next attempt to avoid immediately overloading the API again.
const wait = (delay: number) => new Promise<void>((resolve) => {
		window.setTimeout(resolve, delay);
	});

const fetchData : FetchData = (url, requestOptions) => {
    const apiUrl = `${API_BASE_URL}${url}`;
    // Remove trailing '?' if present
    const cleanedApiUrl = apiUrl.endsWith('?') ? apiUrl.slice(0, -1) : apiUrl;

    return fetch(cleanedApiUrl, requestOptions)
        .then((response) => {
            if (!response.ok) {
                // Preserve the HTTP status so callers can decide whether to retry.
                throw new ApiError(response.status, response.statusText);
            }

            if (requestOptions.method !== 'DELETE')
                return response.json();

        }).catch((error) => {
            throw error;
        });
};

// Retry temporary GET failures with an increasing delay.
const fetchGetWithRetry = async <T>(apiUrl: string, attempt = 0): Promise<T | undefined> => {
	try {
		return await fetchData<T>(apiUrl, {
			method: 'GET',
		});

	} catch (error) {
		const canRetry = error instanceof ApiError && RETRYABLE_STATUS_CODES.has(error.status) && attempt < GET_RETRY_COUNT;

		if (!canRetry) {
			throw error;
		}

		const nextAttempt = attempt + 1;
		console.warn(`Retrying GET "${apiUrl}" ` +`(${nextAttempt}/${GET_RETRY_COUNT})...`);
		await wait(RETRY_DELAY_MS * nextAttempt);

		return fetchGetWithRetry<T>(apiUrl, nextAttempt);
	}
};


export const apiGet: ApiGet = async (url, params) => {
	const searchParams = new URLSearchParams();

	// Add only defined values and convert every query parameter to text.
	Object.entries(params ?? {}).forEach(([key, value]) => {
		if (value != null) {
			searchParams.set(key, String(value));
		}
	});

	const queryString = searchParams.toString();
	const apiUrl = queryString ? `${url}?${queryString}` : url;

	return fetchGetWithRetry(apiUrl);
};


export const apiPost : ApiPost = (url, data) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

// Use in case of future updates on the backend api
export const apiPut : ApiPut = (url, data) => {
    const requestOptions = {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

// Use in case of future updates on the backend api
export const apiDelete : ApiDelete = (url) => {
    const requestOptions = {
        method: "DELETE",
    };

    return fetchData(url, requestOptions);
};