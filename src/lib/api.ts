// This file contains utility functions for making API requests to the backend server.
// It provides functions for GET, POST, PUT, and DELETE requests, handling JSON data and error responses appropriately.

import type { FetchData, ApiGet, ApiPost, ApiPut, ApiDelete } from './types.ts';

// Use the NFCtron API directly during local development.
// In production, route requests through the same-origin `/api` proxy
// configured in vercel.json to avoid browser CORS restrictions.
const NFCTRON_API_URL = 'https://nfctron-frontend-seating-case-study-2024.vercel.app';
const API_BASE_URL = import.meta.env.PROD ? '/api' : NFCTRON_API_URL;

const fetchData : FetchData = (url, requestOptions) => {
    const apiUrl = `${API_BASE_URL}${url}`;
    // Remove trailing '?' if present
    const cleanedApiUrl = apiUrl.endsWith('?') ? apiUrl.slice(0, -1) : apiUrl;

    return fetch(cleanedApiUrl, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }

            if (requestOptions.method !== 'DELETE')
                return response.json();
        })
        .catch((error) => {
            throw error;
        });
};

export const apiGet: ApiGet = (url, params) => {
    const searchParams = new URLSearchParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
        if (value != null) {
            searchParams.set(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    const apiUrl = queryString ? `${url}?${queryString}` : url;

    return fetchData(apiUrl, {
        method: "GET",
    });
};

export const apiPost : ApiPost = (url, data) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

export const apiPut : ApiPut = (url, data) => {
    const requestOptions = {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

export const apiDelete : ApiDelete = (url) => {
    const requestOptions = {
        method: "DELETE",
    };

    return fetchData(url, requestOptions);
};