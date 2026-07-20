// This file contains utility functions for making API requests to the backend server.
// It provides functions for GET, POST, PUT, and DELETE requests, handling JSON data and error responses appropriately.


const API_BASE_URL = "https://nfctron-frontend-seating-case-study-2024.vercel.app";

import type { FetchData, ApiGet, ApiPost, ApiPut, ApiDelete } from './types.ts';

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

export const apiGet : ApiGet = (url, params) => {
    const filteredParams = Object.fromEntries(
        Object.entries(params || {}).filter(([_, value]) => value != null)
    );

    const apiUrl = `${url}?${new URLSearchParams(filteredParams)}`;
    const requestOptions = {
        method: "GET",
    };

    return fetchData(apiUrl, requestOptions);
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