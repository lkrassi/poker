<script lang="ts">
	import Ellipsis from './Ellipsis.svelte';
	import Logout from './Logout.svelte';
	import DailyReward from './DailyReward.svelte';
	import UpdateUsername from './UpdateUsername.svelte';

	import ChipsIcon from '../../assets/icons/ChipsIcon.svelte';

	import { apiFacade } from '$lib/apiFacade';

	import { userStore, setUser } from '../../stores/userStore';
	import { showMessage } from '../../stores/messageStore';
	import { openModal, closeModal } from '../../stores/modalStore';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isImageModalOpen: boolean = false;

	onMount(async () => {
		try {
			const response = await apiFacade.getUserByUsername();

			if (response.success && response.user) {
				setUser(response.user);
			} else {
				goto('/login');
				showMessage(
					'error',
					response.message || 'Для доступа к этой странице необходимо войти в аккаунт'
				);
			}
		} catch (error) {
			goto('/login');
			showMessage('error', 'Ошибка при загрузке данных пользователя');
		}
	});
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closeImageModal();
		}
	};

	const openImageModal = () => {
		isImageModalOpen = true;
		window.addEventListener('keydown', handleKeyDown);
	};

	const closeImageModal = () => {
		isImageModalOpen = false;
		window.removeEventListener('keydown', handleKeyDown);
	};

	const openUpdateUsernameModal = () => {
		openModal(UpdateUsername, {
			title: '',
			onClose: closeModal,
			containerClass: 'update-user-modal'
		});
	};

	onMount(() => {
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

{#if $userStore.user}
	<div class="profile">
		<div class="profile__user-data">
			<div class="profile__img-actions">
				<button class="profile__img" on:click={openImageModal}>
					<img
						class="profile__img"
						src={`https://${$userStore.user?.profile_picture_url}`}
						alt="Аватарка пользователя"
					/>
				</button>
				<Ellipsis />
			</div>
			<button class="profile__username" on:click={openUpdateUsernameModal}>
				{$userStore.user?.username}
			</button>
			<p class="profile__balance">
				{$userStore.user?.balance}
				<span class="profile__icon-wrapper"><ChipsIcon /></span>
			</p>
			<Logout />
		</div>

		<DailyReward />
	</div>
{/if}

{#if isImageModalOpen && $userStore.user}
	<button class="modal-overlay" on:click={closeImageModal}>
		<div class="modal-content">
			<img
				src={`https://${$userStore.user?.profile_picture_url}`}
				alt="Аватарка пользователя в полном размере"
				class="modal-image"
			/>
		</div>
	</button>
{/if}

<style lang="scss">
	.profile {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin: 0 auto;
		padding: 0 5rem;
		gap: 2rem;

		&__user-data {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		&__img-actions {
			display: flex;
		}

		&__img {
			width: 11rem;
			height: 11rem;
			border-radius: 50%;
			object-fit: cover;
			margin-bottom: 1.5rem;
			cursor: pointer;
			transition:
				transform 0.3s ease,
				box-shadow 0.3s ease;

			&:hover {
				transform: scale(1.01);
			}
		}

		&__username {
			font-weight: 600;
			color: var(--text-color);
			font-size: 4rem;
			margin: 1rem 0;
			text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
			padding: 0;
			transition: 0.3s ease;

			&:hover,
			&:focus {
				transform: scale(1.03);
			}
		}

		&__balance {
			color: var(--text-color);
			font-size: 2rem;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-weight: 700;
			transition:
				transform 0.3s ease,
				box-shadow 0.3s ease;
		}

		&__icon-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;

			:global(svg) {
				width: 2rem;
				height: 2rem;
			}
		}
	}

	.modal-overlay {
		border-radius: 0;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--modal-overlay-color);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 3;

		.modal-content {
			.modal-image {
				width: 70%;
				height: 35rem;
				border-radius: 10%;
				object-fit: cover;
			}
		}
	}

	@media (min-width: 576px) and (max-width: 991.98px) {
		.profile {
			flex-wrap: wrap;
		}
	}

	@media (max-width: 576px) {
		.profile {
			flex-direction: column;
			align-items: center;
			padding: 0;

			&__user-data {
				margin: 6rem 0 0;
				align-items: center;

				.profile__username {
					font-size: 2.5rem;
				}
			}
		}

		.modal-overlay {
			.modal-content {
				.modal-image {
					width: 90%;
					height: 20rem;
					border-radius: 10%;
					object-fit: cover;
				}
			}
		}
	}
</style>
