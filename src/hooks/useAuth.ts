import { useEffect, useState } from 'react';
import type { AuthNotificationType } from '@/components/notifications/AuthNotification.tsx';
import { useTranslation } from '@/hooks/useTranslation.ts';
import { apiPost } from '@/lib/api.ts';
import { getApiErrorKey } from '@/lib/api-errors.ts';
import type { LoginRequest, LoginResponse, UserDetails } from '@/lib/types.ts';

const AUTH_NOTIFICATION_DURATION_MS = 5000;

interface UseAuthResult {
	loggedInUser: UserDetails | null;
	authNotification: AuthNotificationType | null;
	loginError: string | null;
	isLoginSubmitting: boolean;
	authenticate: (credentials: LoginRequest) => Promise<UserDetails>;
	submitLogin: (credentials: LoginRequest) => Promise<UserDetails | null>;
	logout: () => void;
	clearLoginError: () => void;
}

export function useAuth(): UseAuthResult {
	const { t } = useTranslation();

	// Keep the authenticated user in one shared place so every
	// authentication flow updates the same application state.
	const [loggedInUser, setLoggedInUser] = useState<UserDetails | null>(null);

	// The notification type determines whether the UI displays
	// the successful login or logout message.
	const [authNotification, setAuthNotification] = useState<AuthNotificationType | null>(null);

	// These states belong specifically to the standalone login form.
	// Checkout keeps its own error and submission state because it
	// continues with order creation after authentication succeeds.
	const [loginError, setLoginError] = useState<string | null>(null);
	const [isLoginSubmitting, setIsLoginSubmitting] =useState(false);

	const authenticate = async (credentials: LoginRequest): Promise<UserDetails> => {
		// This shared function performs only the authentication request
		// and successful state update. Errors are intentionally rethrown
		// so standalone login and checkout can display them independently.
		const response =
			await apiPost<LoginResponse>('/login', {
				email: credentials.email,
				password: credentials.password,
			});

		// apiPost currently allows undefined in its return type,
		// so explicitly reject an empty successful response.
		if (!response) {
			throw new Error('Sign in failed.');
		}

		setLoggedInUser(response.user);
		setAuthNotification('login');

		return response.user;
	};

	const submitLogin = async (credentials: LoginRequest): Promise<UserDetails | null> => {
		setIsLoginSubmitting(true);
		setLoginError(null);

		try {
			// Return the user so App can close the dialog only
			// after authentication has completed successfully.
			return await authenticate(credentials);
		} catch (error: unknown) {
			// Convert the technical API error into a short message
			// translated according to the current application language.
			setLoginError(
				t(getApiErrorKey(error, 'login'))
			);

			return null;
		} finally {
			// Always restore the form state, including failed requests.
			setIsLoginSubmitting(false);
		}
	};

	const logout = () => {
		// Authentication owns the user session state, while App remains
		// responsible for closing presentation-only dialogs.
		setLoggedInUser(null);
		setAuthNotification('logout');
	};

	const clearLoginError = () => {
		// Remove an error left by the previous dialog submission
		// before the user starts a new login attempt.
		setLoginError(null);
	};

	useEffect(() => {
		if (!authNotification) {
			return;
		}

		// Automatically remove successful authentication feedback
		// so notification messages do not remain on screen indefinitely.
		const timerId = window.setTimeout(() => {
			setAuthNotification(null);
		}, AUTH_NOTIFICATION_DURATION_MS);

		return () => {
			// Clear the previous timer when the notification changes
			// or when the component using this hook is unmounted.
			window.clearTimeout(timerId);
		};
	}, [authNotification]);

	return {
		loggedInUser,
		authNotification,
		loginError,
		isLoginSubmitting,
		authenticate,
		submitLogin,
		logout,
		clearLoginError,
	};
}