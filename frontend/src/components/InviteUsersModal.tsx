import * as Sentry from '@sentry/react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Channel } from 'stream-chat';
import { useChatContext } from 'stream-chat-react';
type InviteUsersModalProps = {
	onClose: () => void;
	channel: Channel;
};

const InviteUsersModal = ({ onClose, channel }: InviteUsersModalProps) => {
	const { client } = useChatContext();
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [isinviting, setIsinviting] = useState(false);
	const fetchUsers = async () => {
		const response = await client.queryUsers({});

		const users = response.users.filter(
			(user) =>
				!Object.values(channel.state.members)
					.map((member) => member.user?.id)
					.includes(user.id)
		);
		return users;
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsinviting(true);
		try {
			console.log('Selected users to invite:', selectedUsers);
			console.log(
				'is Channel owner',
				client.user?.id,
				channel?.data?.createdBy
			);
			await channel.addMembers(selectedUsers);
			toast.success('Users invited successfully');
			onClose();
		} catch (error) {
			console.error('Error inviting users:', error);
			Sentry.captureException(error, {
				tags: { component: 'InviteUsersModal' },
				extra: { context: 'error_inviting_users' },
			});
			toast.error('Error inviting users');
		} finally {
			setIsinviting(false);
		}
	};
	const {
		data: users,
		isLoading: loading,
		error,
	} = useQuery({ queryKey: ['users', channel.id], queryFn: fetchUsers });

	const handleUserSelection = (id: string) => {
		if (selectedUsers.includes(id)) {
			setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
		} else {
			setSelectedUsers([...selectedUsers, id]);
		}
	};

	return (
		<div className=" !fixed !inset-0  flex items-center justify-center z-50 bg-black/50 ">
			<div className="create-channel-modal ">
				<div className="create-channel-modal__header">
					<h2>Invite Users</h2>

					<button onClick={onClose} className="create-channel-modal__close">
						<XIcon className="size-4 text-white" />
					</button>
				</div>
				<form className="create-channel-modal__form " onSubmit={handleSubmit}>
					{loading ? (
						'Loading Users ...'
					) : error ? (
						'Error Loading Users !'
					) : (
						<div className="form-group">
							<label htmlFor="channel-type">Select Members</label>
							{/* help me style this */}
							{users?.length === 0 && (
								<p className="radio-option text-white ">
									<span className="mx-auto">No users found</span>
								</p>
							)}
							<div className="radio-group">
								{users?.map((user) => {
									return (
										<label className="radio-option">
											<div className="radio-content">
												<div className=" flex items-center gap-2">
													<div className="relative flex items-center">
														{user?.image ? (
															<img
																src={user.image}
																alt={user?.name || user?.id}
																className="size-8 rounded-full"
															/>
														) : (
															<span className="text-xl font-bold uppercase rounded-full bg-gray-300 h-8 w-8 flex items-center justify-center">
																{(user?.name || user?.id)
																	?.charAt(0)
																	.toUpperCase()}
															</span>
														)}
														<span
															className={clsx(
																'size-2.5 absolute -top-0.5 -right-0.5 border-none rounded-full',
																user?.online ? 'bg-green-400' : 'bg-gray-400'
															)}
														/>
													</div>
													<span>{user?.name || user?.id}</span>
												</div>
											</div>

											<input
												type="checkbox"
												onChange={() => handleUserSelection(user.id)}
											/>
										</label>
									);
								})}
							</div>
						</div>
					)}
					<div className="create-channel-modal__actions">
						<button
							type="button"
							onClick={onClose}
							className="btn btn-secondary"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isinviting || selectedUsers.length === 0}
							className="btn btn-primary"
						>
							{isinviting ? 'Inviting..' : 'Invite Users'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default InviteUsersModal;
