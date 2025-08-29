import { HashIcon, UsersIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import {
	useChatContext,
	type ChannelListMessengerProps,
} from 'stream-chat-react';

const CustomChannelList: React.ComponentType<
	ChannelListMessengerProps & { children?: string }
> = (probs) => {
	const { children, loading, error } = probs;
	const { client: streamClient, setActiveChannel } = useChatContext();

	const [searchParams, setSearchParams] = useSearchParams();
	console.log('list rendered');
	useEffect(() => {
		if (!streamClient?.user) return;
		const channelId = searchParams.get('channelId');

		if (!channelId) return;
		const channel = streamClient.channel('messaging', channelId);
		if (setActiveChannel) {
			setActiveChannel(channel);
		}
	}, [streamClient, searchParams, setActiveChannel]);

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
			<div className="channels-list"></div>
		</div>
	);
};

export default CustomChannelList;
