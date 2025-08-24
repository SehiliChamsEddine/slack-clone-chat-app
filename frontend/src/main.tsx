import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import * as Sentry from '@sentry/react';
import {
	BrowserRouter,
	createRoutesFromChildren,
	matchRoutes,
	useLocation,
	useNavigationType,
} from 'react-router';

import { Toaster } from 'sonner';
import './index.css';
import AuthProvider from './providers/AuthProvider.tsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
if (!PUBLISHABLE_KEY) {
	throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}
if (!SENTRY_DSN) {
	throw new Error('Missing VITE_SENTRY_DSN');
}

Sentry.init({
	dsn: SENTRY_DSN,
	integrations: [
		Sentry.reactRouterV7BrowserTracingIntegration({
			useEffect: React.useEffect,
			useLocation,
			useNavigationType,
			createRoutesFromChildren,
			matchRoutes,
		}),
	],
	tracesSampleRate: 1.0,
});

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<App />
					</AuthProvider>
					<Toaster position="top-right" richColors />
				</QueryClientProvider>
			</BrowserRouter>
		</ClerkProvider>
	</StrictMode>
);
