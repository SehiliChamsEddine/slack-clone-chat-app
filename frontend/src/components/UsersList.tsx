import * as Sentry from '@sentry/react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { CircleIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import type { Channel, StreamChat } from 'stream-chat';

const UsersList = ({
	activeChannel,
	streamClient,
}: {
	activeChannel?: Channel;
	streamClient: StreamChat;
	setActiveChannel: (channel: Channel) => void;
}) => {
	const [, setSearchParams] = useSearchParams();
	const fetchUsers = useCallback(async () => {
		if (!streamClient?.user) return;

		const response = await streamClient.queryUsers({}, {}, { presence: true });
		const users = response.users.filter(
			(user) =>
				user.id !== streamClient.user?.id && !user.id.startsWith('recording-')
		);

		return users;
	}, [streamClient]);
	const {
		data: usersData,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['users', streamClient.user?.id],
		queryFn: fetchUsers,
		refetchInterval: 1000 * 5 * 30, // 5 min refetch
	});

	const generateChannel = async (targetUserId: string) => {
		if (!streamClient?.user || !activeChannel) return;
		// Create a unique channel ID based on user IDs
		const channelId = [streamClient.user.id, targetUserId]
			.sort()
			.join('-')
			.slice(0, 64);
		try {
			const channel = streamClient.channel('messaging', channelId, {
				members: [streamClient.user.id, targetUserId],
			});
			await channel.watch();
			setSearchParams({ channelId: channel?.id || '' });
		} catch (error) {
			console.error('Error creating channel:', error);
			Sentry.captureException(error, {
				tags: { component: 'UsersList' },
				extra: { context: 'Error creating Direct Message channel' },
			});
		}
	};

	return (
		<div>
			{isLoading && <p>Loading users...</p>}
			{error && <p>Error loading users</p>}
			<div className="team-channel-list__users">
				{usersData?.map((user) => {
					const channelId = [streamClient?.user?.id, user.id]
						.sort()
						.join('-')
						.slice(0, 64);

					const channel = streamClient?.channel('messaging', channelId);
					const isActive =
						activeChannel && activeChannel?.data?.id === channelId;
					const unreadCount = channel?.countUnread() || 0;

					return (
						<button
							key={user.id}
							onClick={() => generateChannel(user.id)}
							className={clsx(
								'str-chat__channel-preview-messenger cursor-pointer',
								isActive
									? '!bg-black/20 border-l-8 border-purple-500 shadow-lg '
									: ''
							)}
						>
							<div className="flex items-center w-full gap-2">
								<div className="relative">
									{user?.image ? (
										<img
											src={user.image}
											alt={user.name || user.id}
											className="size-4 rounded-full"
										/>
									) : (
										<div className="size-4 rounded-full bg-gray-400 flex items-center justify-center">
											<span className="text-xs text-white">
												{(user?.name || user.id).charAt(0).toUpperCase()}
											</span>
										</div>
									)}
									<CircleIcon
										className={clsx(
											'size-2 absolute -bottom-0.5 -right-0.5',
											user?.online
												? 'text-green-400 fill-green-400 '
												: 'text-gray-400 fill-gray-400'
										)}
									/>
								</div>
							</div>
							<span className="str-chat__channel-preview-messenger-name truncate">
								{user?.name || user.id}
							</span>
							{unreadCount > 0 && (
								<span className="flex items-center justify-center w-4 h-4 bg-red-500  rounded-full text-xs text-white">
									{unreadCount}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default UsersList;
