import * as Sentry from '@sentry/react';
import { CircleAlertIcon, HashIcon, LockIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import type { UserResponse } from 'stream-chat';
import type { DefaultChannelData } from 'stream-chat-react';
import { useChatContext } from 'stream-chat-react';

type CreateChannelModalProps = {
	onClose: () => void;
};

declare module 'stream-chat' {
	interface CustomChannelData extends DefaultChannelData {
		name?: string;
		description?: string;
		createdBy?: string;
		members?: string[];
		visibility?: 'public' | 'private';
		discoverable?: boolean;
		isPrivate?: boolean;
	}
}

const CreateChannelModal = ({ onClose }: CreateChannelModalProps) => {
	const { client, setActiveChannel } = useChatContext();
	const [searchParams, setSearchParams] = useSearchParams();
	const [users, setUsers] = useState<UserResponse[]>([]);
	const [isUsersLoading, setIsUsersLoading] = useState(false);
	const [error, setError] = useState('');
	const [channelName, setChannelName] = useState('');
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [channelDescription, setChannelDescription] = useState('');
	const [channelType, setChannelType] = useState<'public' | 'private'>(
		'public'
	);
	const [isCreating, setIsCreating] = useState(false);
	useEffect(() => {
		const getUsers = async () => {
			if (!client) return;
			try {
				setIsUsersLoading(true);
				const response = await client.queryUsers(
					{}, // no filter, so all users
					{ name: 1 }, // sort by name ascending
					{ limit: 100 }
				);
				const users = response.users.filter(
					(user) => user.id !== client?.user?.id
				);
				console.log('fetched users', response.users);
				console.log('filtered users ', users);
				console.log('client user ', client?.user);
				setUsers(users);
			} catch (error) {
				console.error('Error fetching users:', error as Error);
				Sentry.captureException(error, {
					tags: { component: 'CreateChannelModal' },
					extra: { context: 'error_retrieving_users' },
				});
				setUsers([]);
			} finally {
				setIsUsersLoading(false);
			}
		};
		getUsers();
	}, [client]);
	useEffect(() => {
		setChannelName('');
		setError('');
		setSelectedUsers([]);
	}, []);
	useEffect(() => {
		console.log('users', users);
		if (channelType === 'public') {
			setSelectedUsers(users.map((user) => user.id));
		} else {
			setSelectedUsers([]);
		}
	}, [channelType, users]);
	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const channelName = event.target.value;
		setChannelName(channelName);
		// some same restriction * following standards
		if (channelName.trim().length < 3 || channelName.trim().length > 100) {
			setError('Channel name must be between 3 and 100 characters.');
			return;
		}
		setError('');
	};
	const handleDescriptionChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setChannelDescription(event.target.value);
	};
	const handleInviteUsers = (id: string) => {
		if (selectedUsers.includes(id)) {
			setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
		} else {
			setSelectedUsers([...selectedUsers, id]);
		}
	};

	const handleOnSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!client?.user || isCreating || error) return;
		setIsCreating(true);
		const channelId = channelName
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.slice(0, 20);
		const channel = client.channel('messaging', channelId, {
			name: channelName.trim(),
			description: channelDescription ? channelDescription : undefined,
			createdBy: client.user.id,
			members: [...selectedUsers, client.user.id],
			visibility: channelType === 'public' ? 'public' : 'private',
			isPrivate: channelType === 'private',
			discoverable: channelType === 'public',
		});
		try {
			await channel.watch();
			setActiveChannel(channel);
			setSearchParams({ channelId: channelId });
			toast.success('Channel created successfully!');
		} catch (error) {
			console.error('Error creating channel:', error);
			Sentry.captureException(error, {
				tags: { component: 'CreateChannelModal' },
				extra: { context: 'error_creating_channel' },
			});
			toast.error('Error creating channel.\n Please Try Again!');
		} finally {
			setIsCreating(false);
			onClose();
		}
	};
	return (
		<div className="create-channel-modal-overlay">
			<div className="create-channel-modal ">
				<div className="create-channel-modal__header">
					<h2>Create Channel</h2>

					<button onClick={onClose} className="create-channel-modal__close">
						<XIcon className="size-4 text-white" />
					</button>
				</div>
				<form
					action=""
					onSubmit={handleOnSubmit}
					className="create-channel-modal__form "
				>
					{error && (
						<div className="form-error">
							<CircleAlertIcon className="size-4" />
							<span>{error}</span>
						</div>
					)}
					<div className="form-group">
						<label htmlFor="channel-name">Channel Name</label>
						<div className="input-with-icon">
							<HashIcon className="input-icon size-4" />
							<input
								className="form-input"
								id="channel-name"
								type="text"
								placeholder="eg. marketing"
								value={channelName}
								onChange={handleNameChange}
								maxLength={30}
								autoFocus
							/>
						</div>
						{channelName && (
							<div className="form-hint">
								Channel Id will be:
								<strong>
									#{' '}
									{channelName
										.trim()
										.toLowerCase()
										.replace(/\s+/g, '-')
										.replace(/[^\w-]+/g, '')
										.slice(0, 20)}
								</strong>
							</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="channel-type">Channel Type</label>
						<div className="radio-group">
							<label className="radio-option">
								<input
									type="radio"
									id="public"
									name="channel-type"
									value="public"
									checked={channelType === 'public'}
									onChange={() => setChannelType('public')}
								/>

								<div className="radio-content">
									<HashIcon className="size-4 text-white" />
									<div>
										<div className="radio-title">Public</div>
										<div className="radio-description">
											Any one can join this channel
										</div>
									</div>
								</div>
							</label>
							<label className="radio-option">
								<input
									type="radio"
									id="private"
									name="channel-type"
									value="private"
									checked={channelType === 'private'}
									onChange={() => setChannelType('private')}
								/>

								<div className="radio-content">
									<LockIcon className="size-4 text-white" />
									<div>
										<div className="radio-title">Private</div>
										<div className="radio-description">
											Only invited members can join
										</div>
									</div>
								</div>
							</label>
						</div>
					</div>

					{channelType === 'private' && (
						<div className="form-group">
							<label>Invite Users</label>
							<div className="member-selection-header">
								<button
									type="button"
									onClick={() => setSelectedUsers(users.map((user) => user.id))}
									className="btn btn-secondary btn-small"
								>
									Invite All
								</button>
								<span className="selected-count">
									{selectedUsers.length} selected
								</span>
							</div>
							<div className="members-list">
								{isUsersLoading ? (
									<p>Loading users...</p>
								) : users.length > 0 ? (
									<ul>
										{users.map((user) => (
											<label key={user.id} className="member-item">
												<input
													className="member-checkbox"
													type="checkbox"
													checked={selectedUsers.includes(user.id)}
													onChange={() => handleInviteUsers(user.id)}
												/>
												{user.image ? (
													<img
														src={user.image}
														alt={user.name || user.id}
														className="member-avatar"
													/>
												) : (
													<div className="member-avatar member-avatar-placeholder">
														<span className="member-name">
															{(user.name || user.id).charAt(0).toUpperCase()}
														</span>
													</div>
												)}
												<span className="member-name">
													{user.name || user.id}
												</span>
											</label>
										))}
									</ul>
								) : (
									<p>No users found.</p>
								)}
							</div>
						</div>
					)}
					<div className="form-group">
						<label htmlFor="channel-description">Channel Description</label>
						<textarea
							id="channel-description"
							className="form-textarea"
							value={channelDescription}
							onChange={handleDescriptionChange}
							placeholder="What is this channel about?"
							rows={3}
						/>
					</div>
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
							disabled={isCreating}
							className="btn btn-primary"
						>
							{isCreating ? 'Creating...' : 'Create Channel'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateChannelModal;
