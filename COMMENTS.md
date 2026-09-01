# Implementation comments

## API availability and gateway timeouts

The application communicates with the external NFCtron case-study API. During development and deployment, the API occasionally returned an HTTP `504 Gateway Timeout` response accompanied by Vercel's `FUNCTION_INVOCATION_TIMEOUT` error.

This timeout originates from the external API infrastructure. Because the API implementation and its Vercel configuration are outside the scope of this repository, the frontend cannot remove the underlying cause.

The application handles this limitation as follows:

- Safe `GET` requests are retried a limited number of times with an increasing delay.
- Only temporary `502`, `503`, and `504` responses trigger an automatic retry.
- Loading indicators remain visible while another request attempt is in progress.
- After all attempts fail, the error is exposed to the user instead of leaving the application in an indefinite loading state.
- Login and checkout dialogs remain open after a failed request so the user can try again.
- Selected seats remain in the cart when order creation fails.

`POST /order` is intentionally not retried automatically. A timed-out request may still have been processed by the server, and repeating it could create a duplicate order. A fully reliable retry mechanism would require backend support for `idempotency keys` or an endpoint for checking the order status.

## CORS and deployment proxy

The external API does not consistently allow requests from the deployed frontend origin. The application therefore sends requests through the same-origin `/api` path.

During local development, Vite proxies `/api` requests to the NFCtron API. In production, Vercel rewrites the same path to the external API. This keeps the frontend API configuration consistent between development and production and avoids browser CORS restrictions.

The proxy does not fix upstream API timeouts. It only provides same-origin communication between the browser and the external service.