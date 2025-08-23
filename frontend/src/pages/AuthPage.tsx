import { SignInButton } from '@clerk/clerk-react';
import '../styles/auth.css';
const AuthPage = () => {
	return (
		<div className="auth-container">
			<div className="auth-left">
				<div className="auth-hero">
					<div className="brand-container">
						<img src="/logo.png" className="brand-logo" alt="Slap Logo" />

						<div className="brand-name">slap</div>
					</div>
					<h1 className="hero-title">Where Work Happens ✨</h1>
					<p className="hero-subtitle">
						Connect with your team instantly through secure, real-time
						messaging. Experience seamless collaboration with powerful features
						designed for modern teams.
					</p>
					<ul className="features-list">
						<li className="feature-item">
							{' '}
							<span className="feature-icon">💬</span>
							<span>Real-time messaging</span>
						</li>
						<li className="feature-item">
							<span className="feature-icon">🎥</span>
							<span>Video calls & meetings</span>
						</li>
						<li className="feature-item">
							<span className="feature-icon">🔒</span>
							<span>Secure & private</span>
						</li>
					</ul>

					<SignInButton mode="modal">
						<button className="cta-button">
							Get Started With Slap
							<span className="button-arrow">→</span>
						</button>
					</SignInButton>
				</div>
			</div>
			<div className="auth-right">
				<div className="auth-image-container">
					<img src="/auth-i.png" alt="Auth" className="auth-image" />
					<div className="image-overlay" />
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
