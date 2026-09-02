# Implementation comments

## Solution overview

EVENtron is a responsive single-page application for browsing an event, selecting seats and creating ticket orders through the NFCtron case-study API.

The core requirements were implemented first. Additional work focused on maintainability, accessibility, API resilience, responsive design and user experience.

- Repository: [Nazar-Pichak/frontend-case-study](https://github.com/Nazar-Pichak/frontend-case-study)
- Production: [frontend-case-study-beta.vercel.app](https://frontend-case-study-beta.vercel.app)
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)

## Implemented requirements

The application supports:

- loading event details from the API;
- displaying the event image, name, description, dates and venue;
- loading dynamically generated seating data;
- rendering rows and seats in their correct positions;
- representing missing positions as unavailable seats;
- adding and removing seats from the cart;
- displaying the current ticket count and total price;
- formatting prices according to the event currency;
- guest checkout;
- login checkout;
- standalone login and logout;
- creating an order through the API;
- displaying successful order information;
- preserving the cart when order creation fails;
- displaying short localized API error messages.

## Additional features

The implementation also includes:

- responsive desktop and mobile layouts;
- Czech and English localization;
- a cart dialog available from the header;
- user profile presentation;
- purchased-seat visualization;
- a separate “My seat” state for authenticated purchases;
- Google, Outlook, Office 365 and Yahoo calendar links;
- downloadable ICS calendar files;
- scroll-aware translucent header;
- scroll-to-top control;
- reusable loading and error states;
- accessibility labels and live status messages;
- deployment through Vercel;
- automated tests and CI/CD.

## Architecture and state management

The application is organized into feature components and custom hooks.

Feature components are grouped by responsibility:

- `auth` — login and user profile;
- `cart` — cart dialog and selected-seat summary;
- `checkout` — guest and authenticated checkout;
- `event` — event details and calendar integration;
- `layout` — application header and footer;
- `notifications` — authentication and order feedback;
- `seating` — stage, rows, seats and legend;
- `ui` — reusable visual primitives.

Stateful application logic is separated into custom hooks:

- `useEventData` loads event and seating data;
- `useCart` manages selected seats and total price;
- `useAuth` manages authentication state;
- `useCheckout` manages order creation and purchased seats;
- `useScrollState` manages the header scroll state;
- `useTranslation` provides localized UI text.

`App.tsx` acts as an orchestration layer. It connects hook results with feature components and owns only simple dialog visibility state.

A graphical overview is available in [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🚨 API availability and gateway timeouts 🚨

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

## 🚨 CORS and deployment proxy 🚨

The external API does not consistently allow requests from the deployed frontend origin. The application therefore sends requests through the same-origin `/api` path.

During local development, Vite proxies `/api` requests to the NFCtron API. In production, Vercel rewrites the same path to the external API. This keeps the frontend API configuration consistent between development and production and avoids browser CORS restrictions.

The proxy does not fix upstream API timeouts. It only provides same-origin communication between the browser and the external service.

## Seating behavior

The API generates a different number of rows and seats after page refreshes. Seats may also arrive out of order or with missing positions.

The seating map therefore:

- calculates the highest seat position dynamically;
- creates a consistent grid for every row;
- maps seats by their `place` value instead of array order;
- renders missing positions as unavailable;
- disables purchased seats for the current page session;
- displays authenticated purchases as “My seat”;
- displays the same seats as unavailable after logout.

## Testing

The project uses Vitest and React Testing Library.

Current automated tests cover:

- initial empty-cart state;
- adding a seat;
- removing an already selected seat;
- calculating the total price;
- clearing the cart;
- handling a missing ticket type;
- network failure mapping;
- invalid login credentials;
- client request errors;
- gateway timeout errors;
- server availability errors;
- unexpected error fallback.

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Continuous integration and deployment

GitHub Actions runs the following checks for pushes and pull requests targeting `main`:

```bash
npm ci
npm run lint
npm test
npm run build
```

The workflow uses Node.js 20 and installs exact dependency versions from `package-lock.json`.

Vercel is connected to the GitHub repository and automatically deploys changes pushed to the production branch.

## Running locally

Requirements:

- Node.js 20 or newer;
- npm.

Install exact dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Run all quality checks:

```bash
npm run lint
npm test
npm run build
```

## Time scope

The suggested 2–4 hour time frame is sufficient for implementing the core purchase flow.

I intentionally invested additional time in optional features and production-oriented improvements, including responsive seating visualization, localization, calendar integration, API error handling, CORS proxy configuration, accessibility, deployment, testing and codebase refactoring.

The core requirements were implemented first. The additional work demonstrates my approach to maintainability, user experience and unreliable external services.

## Known limitations

- Authentication is not persisted after a page refresh because the API does not provide a token or session mechanism.
- Purchased and unavailable seat state is stored only in frontend memory.
- The API generates new randomized seating data after a refresh.
- A timed-out order request has an ambiguous result because the API does not provide idempotency or order-status verification.
- External event descriptions and backend response messages are displayed as returned by the API and are not translated by the frontend.
- The user profile uses a static demonstration image.

## Possible future improvements

Given additional backend support, the next improvements would be:

- persistent authenticated sessions;
- persistent order history;
- idempotency keys for safe order retries;
- an endpoint for checking order status;
- server-confirmed seat availability updates;
- broader integration and component test coverage;
- end-to-end checkout testing.