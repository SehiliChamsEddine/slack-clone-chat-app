import { useUser } from '@clerk/clerk-react';
import * as Sentry from '@sentry/react';
import {
	Call,
	CallControls,
	CallingState,
	SpeakerLayout,
	StreamCall,
	StreamTheme,
	StreamVideo,
	StreamVideoClient,
	useCallStateHooks,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { getStreamToken } from '../lib/api';
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
	const [client, setClient] = useState<StreamVideoClient | undefined>(
		undefined
	);
	const { id: callId } = useParams();
	const [isConnecting, setIsConnecting] = useState<boolean>(true);
	const [call, setCall] = useState<Call | undefined>(undefined);

	const {
		data: token,
		isLoading,
		error,
	} = useQuery({ queryKey: ['streamToken'], queryFn: getStreamToken });
	const { user, isLoaded } = useUser();

	useEffect(() => {
		const initStreamClient = async () => {
			if (!user || !token || !callId) return;

			const client = new StreamVideoClient(STREAM_API_KEY);
			try {
				await client.connectUser(
					{
						id: user.id,
						name: `${user.firstName} ${user.lastName}`,
						image: user.imageUrl,
					},
					token.token
				);
				const callInstance = client.call('default', callId);

				await callInstance.join({ create: true });

				setClient(client);
				setCall(callInstance);
			} catch (err) {
				console.error('Failed to connect user', err);
				Sentry.captureException(err, {
					tags: { component: 'CallPage' },
					extra: { context: 'error connecting user call' },
				});
				toast.error(
					'Failed to connect to call , please refresh or try again later'
				);
			} finally {
				setIsConnecting(false);
			}
		};
		initStreamClient();
		return () => {
			client?.disconnectUser();
			setClient(undefined);
		};
	}, [callId, user, token]);

	if (isConnecting || !isLoaded) {
		return (
			<div className="flex items-center justify-center h-full">
				Connecting...
			</div>
		);
	}
	if (!client) {
		return (
			<div className="flex items-center justify-center h-full">
				Failed to connect to call , refresh or try again later
			</div>
		);
	}

	return (
		<div className="h-screen flex flex-col items-center justify-center bg-gray-100">
			<div className="relative w-full max-w-4xl mx-auto">
				<StreamVideo client={client}>
					<StreamCall call={call}>
						<VideoCall />
					</StreamCall>
				</StreamVideo>
			</div>
		</div>
	);
};

const VideoCall = () => {
	const { useCallCallingState } = useCallStateHooks();
	const callingState = useCallCallingState();
	const navigate = useNavigate();

	if (callingState === CallingState.LEFT) {
		navigate('/');
	}

	return (
		<StreamTheme>
			<SpeakerLayout />
			<CallControls />
		</StreamTheme>
	);
};
export default CallPage;
