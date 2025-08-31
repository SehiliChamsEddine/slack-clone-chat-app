import { HashIcon, LockIcon, Pin, UsersIcon, VideoIcon } from 'lucide-react';
import { useState } from 'react';
import type { LocalMessage } from 'stream-chat';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';
import InviteUsersModal from './InviteUsersModal';
import MembersModal from './MembersModal';
import PinnedMessagesModal from './PinnedMessagesModal';

const CustomChannelHeader = () => {
	const { channel } = useChannelStateContext();
	const { client } = useChatContext();
	const [showPinned, setShowPinned] = useState(false);
	const [showMembers, setShowMembers] = useState(false);
	const [showInvite, setShowInvite] = useState(false);

	const [pinnedMessages, setPinnedMessages] = useState<LocalMessage[]>([]);

	const isDM =
		channel &&
		channel.data?.member_count === 2 &&
		channel.id?.includes('user_');
	const user = Object.values(channel.state.members).find(
		(member) => member.user?.id !== client.user?.id
	);
	const handleVideoCall = async () => {
		const redirectUrl = `${window.location.origin}/call/${channel.id}`;
		const message = `${client.user?.name} opened a new video call , you can join via link : ${redirectUrl}`;
		await channel.sendMessage({ text: message });

		return redirectUrl;
	};
	const handlePinned = () => {
		const pinnedMessages = channel.state.pinnedMessages;
		if (pinnedMessages.length > 0) {
			setPinnedMessages(pinnedMessages);
			setShowPinned(true);
		}
	};
	return (
		<div className="flex h-16 border-b border-gray-200 justify-between items-center  ">
			<div className="flex gap-3 items-center ml-2">
				{channel.data?.isPrivate ? (
					<LockIcon className=" size-4 text-[#616061]" />
				) : (
					<HashIcon className=" size-4 text-[#616061]" />
				)}

				{isDM ? (
					<div className="flex gap-1 items-center">
						{user?.user?.image ? (
							<img
								src={user?.user?.image}
								alt=""
								className="h-8 w-8 rounded-full"
							/>
						) : (
							<span className="text-xl font-bold uppercase rounded-full bg-gray-300 h-8 w-8 flex items-center justify-center">
								{(user?.user?.name || user?.user?.id)?.charAt(0)}
							</span>
						)}
						<span className=" font-medium text-[#1D1C1D] ">
							{' '}
							{user?.user?.name || user?.user?.id}{' '}
						</span>
					</div>
				) : (
					<span className=" font-medium text-[#1D1C1D]">
						{' '}
						{channel.data?.name || channel.id}{' '}
					</span>
				)}
			</div>
			<div className="flex gap-3 mr-2 items-center">
				<button
					className="flex justify-center items-center gap-0.5 px-2 py-1 hover:bg-[#e9e9e9] rounded-full cursor-pointer transition-colors"
					onClick={() => setShowMembers(true)}
				>
					<UsersIcon className="size-5 text-[#616061] " />
					<span className="text-sm">{channel.data?.member_count || 0} </span>
				</button>
				<button
					className="flex justify-center items-center gap-0.5 px-2 py-1 hover:bg-[#e9e9e9] rounded-full cursor-pointer transition-colors"
					onClick={handleVideoCall}
				>
					<VideoIcon className="size-5 text-[#1264A3] " />
				</button>

				{channel.data?.isPrivate && (
					<button
						className="btn btn-primary"
						onClick={() => setShowInvite(true)}
					>
						Invite
					</button>
				)}
				<button
					className="flex justify-center items-center gap-0.5 px-2 py-1 hover:bg-[#e9e9e9] rounded-full cursor-pointer transition-colors"
					onClick={handlePinned}
				>
					<Pin className="size-5 text-[#616061] " />
				</button>
			</div>
			{showMembers && (
				<MembersModal
					members={Object.values(channel.state.members)}
					onClose={() => {
						setShowMembers(false);
					}}
				/>
			)}
			{showPinned && (
				<PinnedMessagesModal
					messages={pinnedMessages}
					onClose={() => {
						setShowPinned(false);
					}}
				/>
			)}

			{showInvite && (
				<InviteUsersModal
					channel={channel}
					onClose={() => setShowInvite(false)}
				/>
			)}
		</div>
	);
};

export default CustomChannelHeader;
