import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import type { ChannelMemberResponse } from 'stream-chat';

type MembersModalProps = {
	members: ChannelMemberResponse[];
	onClose: () => void;
};
const MembersModal = ({ members, onClose }: MembersModalProps) => {
	return (
		<div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
			<div className="w-full max-w-lg mx-4  bg-white rounded-lg overflow-hidden">
				<div className=" flex items-center justify-between w-full h-12 border-b-2  border-gray-500 py-4 px-4 ">
					<span className="text-xl font-medium">Channel Members</span>
					<button
						className=" px-2 py-2 flex items-center justify-center cursor-pointer hover:bg-[#f0f0f0] transition-colors rounded-lg "
						onClick={onClose}
					>
						<XIcon className=" size-5 text-[#616061] " />
					</button>
				</div>
				<div className="w-full my-2 px-4">
					{members.map((member, idx) => {
						const isLastChild = idx === members.length - 1;
						return (
							<div
								key={member.user?.id}
								className={clsx(
									'flex items-center justify-between h-12 ',
									!isLastChild && 'border-b border-gray-300'
								)}
							>
								<div className=" flex items-center gap-2">
									<div className="relative flex items-center">
										{member.user?.image ? (
											<img
												src={member.user.image}
												alt={member.user?.name || member.user?.id}
												className="size-8 rounded-full"
											/>
										) : (
											<span className="text-xl font-bold uppercase rounded-full bg-gray-300 h-8 w-8 flex items-center justify-center">
												{(member?.user?.name || member?.user?.id)
													?.charAt(0)
													.toUpperCase()}
											</span>
										)}
										<span
											className={clsx(
												'size-2.5 absolute -top-0.5 -right-0.5 border-none rounded-full',
												member.user?.online ? 'bg-green-400' : 'bg-gray-400'
											)}
										/>
									</div>
									<span>{member.user?.name || member.user?.id}</span>
								</div>
								<span className="text-[#616061] text-sm">
									{member.user?.online ? 'Online' : 'Offline'}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default MembersModal;
