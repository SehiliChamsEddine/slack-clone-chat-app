import { UserButton } from '@clerk/clerk-react';

import { useState } from 'react';

import {
	Channel,
	ChannelList,
	Chat,
	MessageInput,
	MessageList,
	Thread,
	Window,
} from 'stream-chat-react';

import { PlusIcon } from 'lucide-react';
import CreateChannelModal from '../components/CreateChannelModal';
import CustomChannelHeader from '../components/CustomChannelHeader';
import CustomChannelList from '../components/CustomChannelList';
import CustomChannelPreview from '../components/CustomChannelPreview';
import PageLoader from '../components/PageLoader';
import useStreamClient from '../hooks/useStreamClient';
import '../styles/stream-chat-theme.css';

const HomePage = () => {
	const { streamClient, tokenError, tokenLoading } = useStreamClient();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	if (!streamClient?.user || tokenLoading) return <PageLoader />;

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
								<ChannelList
									//@ts-expect-error members provided structure is valid
									filters={{ members: { $in: [streamClient.user.id] } }}
									options={{ state: true, watch: true }}
									Preview={CustomChannelPreview}
									List={CustomChannelList}
									setActiveChannelOnMount={false}
								/>
							</div>
						</div>
					</div>
					{/* Right Container */}
					<div className="chat-main">
						<Channel>
							<Window>
								<CustomChannelHeader />
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
