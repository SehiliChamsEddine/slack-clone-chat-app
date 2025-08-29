import clsx from 'clsx';
import { HashIcon } from 'lucide-react';
import { useSearchParams } from 'react-router';

import {
	useChatContext,
	type ChannelPreviewUIComponentProps,
} from 'stream-chat-react';

const CustomChannelPreview: React.ComponentType<
	ChannelPreviewUIComponentProps
> = (probs) => {
	const { channel, setActiveChannel, activeChannel } = probs;
	const [searchParams, setSearchParams] = useSearchParams();
	const { client } = useChatContext();

	if (
		!client?.user ||
		(channel.data?.member_count === 2 &&
			(channel.id?.includes('user_') || channel.id?.includes('!members')))
	) {
		return null;
	}
	const unReadCount = channel.countUnread();
	const isActive = activeChannel && activeChannel.id === channel.id;

	return (
		<button
			onClick={() => {
				if (setActiveChannel) setActiveChannel(channel);
				setSearchParams({ channelId: channel.id || '' });
			}}
			className={clsx(
				'str-chat__channel-preview-messenger transition-colors flex items-center px-4 py-2 rounded-ld mb-1 font-medium hover:bg-blue-50/80 min-h-9 cursor-pointer ',
				isActive &&
					'!bg-black/20 border-l-8 border-purple-500 shadow-lg text-blue-900'
			)}
		>
			<HashIcon className="size-4 text-[#9b9b9b] mr-2" />
			<span className="str-chat__channel-preview-messenger-name flex-1">
				{' '}
				{channel.data?.name}
			</span>
			{unReadCount > 0 && (
				<span className="flex items-center justify-center text-xs rounded-full size-4 ml-4 text-red-500">
					{unReadCount}
				</span>
			)}
		</button>
	);
};

export default CustomChannelPreview;
