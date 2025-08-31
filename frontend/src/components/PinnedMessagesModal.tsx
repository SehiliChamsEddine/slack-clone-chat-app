import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import type { LocalMessage } from 'stream-chat';

type PinnedMessagesModalProps = {
	messages: LocalMessage[];
	onClose: () => void;
};

const PinnedMessagesModal = ({
	messages,
	onClose,
}: PinnedMessagesModalProps) => {
	return (
		<div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
			<div className="w-full max-w-lg mx-4  bg-white rounded-lg overflow-hidden">
				<div className=" flex items-center justify-between w-full h-12 border-b-2  border-gray-500 py-4 px-4 ">
					<span className="text-xl font-medium">Pinned messages</span>
					<button
						className=" px-2 py-2 flex items-center justify-center cursor-pointer hover:bg-[#f0f0f0] transition-colors rounded-lg "
						onClick={onClose}
					>
						<XIcon className=" size-5 text-[#616061] " />
					</button>
				</div>
				<div className="w-full my-2 px-4 max-h-[500px]  overflow-x-hidden overflow-y-auto">
					{messages.map((message, idx) => {
						const isLastChild = idx === messages.length - 1;
						return (
							<div
								key={message.user?.id}
								className={clsx(
									'flex sm:items-center sm:justify-between  h-fit py-3 flex-col sm:flex-row gap-6 sm:gap-0 items-start',
									!isLastChild && 'border-b border-gray-300'
								)}
							>
								<div className=" flex items-center gap-2 shrink-0  ">
									<div className="relative flex items-center">
										{message.user?.image ? (
											<img
												src={message.user.image}
												alt={message.user?.name || message.user?.id}
												className="size-8 rounded-full"
											/>
										) : (
											<span className="text-xl font-bold uppercase rounded-full bg-gray-300 h-8 w-8 flex items-center justify-center">
												{(message?.user?.name || message?.user?.id)
													?.charAt(0)
													.toUpperCase()}
											</span>
										)}
										<span
											className={clsx(
												'size-2.5 absolute -top-0.5 -right-0.5 border-none rounded-full',
												message.user?.online ? 'bg-green-400' : 'bg-gray-400'
											)}
										/>
									</div>
									<span>{message.user?.name || message.user?.id}</span>
								</div>
								<span className="text-[#616061] text-sm sm:w-1/2 w-full  overflow-y-auto  box-border block border-x border-gray-300 px-4 break-words">
									{message.text}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default PinnedMessagesModal;
