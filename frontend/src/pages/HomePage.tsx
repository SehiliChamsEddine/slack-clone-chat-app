import { UserButton } from '@clerk/clerk-react';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Channel as StreamChannel } from 'stream-chat';
import {
	Channel,
	ChannelHeader,
	ChannelList,
	Chat,
	MessageInput,
	MessageList,
	Thread,
	Window,
} from 'stream-chat-react';
import CreateChannelModal from '../components/CreateChannelModal';
import PageLoader from '../components/PageLoader';
import useStreamClient from '../hooks/useStreamClient';
import '../styles/stream-chat-theme.css';
const HomePage = () => {
	const [activeChannel, setActiveChannel] = useState<StreamChannel | undefined>(
		undefined
	);
	const [searchParams, setSearchParams] = useSearchParams();
	const { streamClient, tokenError, tokenLoading } = useStreamClient();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	useEffect(() => {
		if (!streamClient) return;
		const channelId = searchParams.get('channelId');
		if (!channelId) return;
		const channel = streamClient.channel('messaging', channelId);

		setActiveChannel(channel);
	}, [streamClient, searchParams]);

	if (!streamClient || tokenLoading) return <PageLoader />;

	if (tokenError) return <p>Something went wrong</p>;

	return (
		<div className="chat-wrapper">
			<Chat client={streamClient}>
				<div className="chat-container">
					{/* Left SideBar */}
					<div className="str-chat__channel-list">
						<div className="team-channel-list">
							{/* Header */}
							<div className="team-channel-list__header gap-4">
								<div className="brand-container">
									<img
										src="./logo.png"
										alt="Slap Logo"
										className="brand-logo"
									/>
									<span className="brand-name">Slap</span>
								</div>
								<div className="user-button-wrapper">
									<UserButton />
								</div>
							</div>
							{/* Channels List */}
							<div className="team-channel-list__content">
								<div className="create-channel-section">
									<button
										onClick={() => {
											setIsCreateModalOpen(true);
										}}
										className="create-channel-btn"
									>
										<PlusIcon className="size-4" />
										Create Channel
									</button>
								</div>
								{/* Channels List */}
							</div>
						</div>
					</div>
					{/* Right Container */}
					<div className="chat-main">
						<Channel channel={activeChannel}>
							<Window>
								<ChannelHeader />
								<MessageList />
								<MessageInput />
							</Window>
							<Thread />
						</Channel>
					</div>
				</div>
				{isCreateModalOpen && (
					<CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />
				)}
			</Chat>
		</div>
	);
};

export default HomePage;
