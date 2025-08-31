import { SignedIn, SignedOut } from '@clerk/clerk-react';

import * as Sentry from '@sentry/react';
import { Navigate, Route, Routes } from 'react-router';
import AuthPage from './pages/AuthPage';
import CallPage from './pages/CallPage';
import HomePage from './pages/HomePage';
export const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

export default function App() {
	return (
		<header>
			<SignedOut>
				<SentryRoutes>
					<Route path="/auth" element={<AuthPage />} />
					<Route path="/*" element={<Navigate to="/auth" replace />} />
				</SentryRoutes>
			</SignedOut>
			<SignedIn>
				<SentryRoutes>
					<Route path="/" element={<HomePage />} />
					<Route path="/call/:id" element={<CallPage />} />
					<Route path="/auth" element={<Navigate to="/" replace />} />
				</SentryRoutes>
			</SignedIn>
		</header>
	);
}
