import { useAuth } from '@clerk/clerk-react';
import { createContext, useEffect } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../lib/axios';

const AuthContext = createContext({});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken } = useAuth();

	useEffect(() => {
		const interceptor = axiosInstance.interceptors.request.use(
			async (config) => {
				try {
					const token = await getToken();
					if (token) {
						config.headers.Authorization = `Bearer ${token}`;
					}
				} catch (error) {
					if (error instanceof Error) {
						if (
							error.message?.includes('auth') ||
							error.message?.includes('token')
						) {
							toast.error('Authentication error. Please Refresh the page!');
							console.log('Failing getting token');
						}
					}
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		return () => {
			axiosInstance.interceptors.request.eject(interceptor);
		};
	}, [getToken]);

	return (
		<>
			{children}
			<AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
		</>
	);
};

export default AuthProvider;
