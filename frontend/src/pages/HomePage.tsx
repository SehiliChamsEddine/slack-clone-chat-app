import { UserButton } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import type { Channel } from 'stream-chat';
import PageLoader from '../components/PageLoader';
import useStreamClient from '../hooks/useStreamClient';

const HomePage = () => {
	const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const { streamClient, tokenError, tokenLoading } = useStreamClient();

	useEffect(() => {
		if (!streamClient) return;

		const channel = streamClient.channel(
			'messaging',
			searchParams.get('channelId')
		);
		setActiveChannel(channel);
	}, [streamClient, searchParams]);

	if (!streamClient || tokenLoading) return <PageLoader />;

	if (tokenError) return <p>Something went wrong</p>;

	return (
		<div>
			<UserButton />
		</div>
	);
};

export default HomePage;
