import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Navigate, Route, Routes } from 'react-router';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

export default function App() {
	return (
		<header>
			<SignedOut>
				<Routes>
					<Route path="/auth" element={<AuthPage />} />
					<Route path="/*" element={<Navigate to="/auth" replace />} />
				</Routes>
			</SignedOut>
			<SignedIn>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/auth" element={<Navigate to="/" replace />} />
				</Routes>
			</SignedIn>
		</header>
	);
}
