import { HashIcon, UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
	useChatContext,
	type ChannelListMessengerProps,
} from 'stream-chat-react';
import UsersList from './UsersList';

const CustomChannelList: React.ComponentType<
	ChannelListMessengerProps & { children?: string }
> = (probs) => {
	const { children, loading, error } = probs;

	const { client: streamClient, setActiveChannel, channel } = useChatContext();

	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		if (!streamClient?.user || loading) return;
		console.log('rendred');
		const channelId = searchParams.get('channelId');
		if (!channelId) {
			const channels = streamClient.activeChannels;
			const sorted = channels
				? Object.values(channels).sort((a, b) => {
						return (
							new Date(a.state.last_message_at || 0).getTime() -
							new Date(b.state.last_message_at || 0).getTime()
						);
				  })
				: [];
			const newest_channel =
				sorted[sorted.length === 0 ? 0 : sorted.length - 1];
			if (newest_channel) {
				setActiveChannel(newest_channel);
			}
			return;
		}
		const channel = streamClient.channel('messaging', channelId);

		if (setActiveChannel) {
			console.log('search params runs');
			setActiveChannel(channel);
		}
	}, [streamClient, searchParams, setActiveChannel, loading]);
	if (!streamClient?.user) return null;

	return (
		<div className="channel-sections">
			<div className="section-header">
				<div className="section-title">
					<HashIcon className="size-4" />
					<span>Channels</span>
				</div>
			</div>
			{loading && <p> Channels being loaded ... </p>}
			{error && <p>Error loading the channel !</p>}
			<div className="channels-list"> {children}</div>

			<div className="section-header">
				<div className="section-title">
					<UsersIcon className="size-4" />
					<span>Direct Messages</span>
				</div>
			</div>
			<div className="channels-list">
				<UsersList
					activeChannel={channel}
					streamClient={streamClient}
					setActiveChannel={setActiveChannel}
				/>
			</div>
		</div>
	);
};

export default CustomChannelList;
