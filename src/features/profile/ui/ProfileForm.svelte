<script lang="ts">
	import { apiFacade } from '../../../shared/lib/api/apiFacade';

	import { userStore } from '../model/stores/userStore';
	import { openModal, closeModal } from '../../../shared/model/stores/modalStore';

	import { onMount } from 'svelte';

	import Ellipsis from './Ellipsis.svelte';
	import Logout from './Logout.svelte';
	import DailyReward from './DailyReward.svelte';
	import UpdateUsername from './UpdateUsername.svelte';
	import ImageModal from './ImageModal.svelte';
	import ChipsIcon from '../../../shared/assets/icons/ChipsIcon.svelte';

	onMount(async () => {
		await apiFacade.getUserByUsername();
	});

	const openImageModal = () => {
		openModal(ImageModal, {
			imageUrl: $userStore.user?.profile_picture_url,
			altText: 'Аватарка пользователя в полном размере',
			onClose: closeModal
		});
	};

	const openUpdateUsernameModal = () => {
		openModal(UpdateUsername, {
			onClose: closeModal,
			containerClass: 'update-username-modal'
		});
	};
</script>

{#if $userStore.user}
	<div class="profile">
		<div class="profile__user-data">
			<div class="profile__img-actions">
				<button id="profile__img" on:click={openImageModal}>
					<img
						class="profile__img"
						src={$userStore.user?.profile_picture_url}
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

		#profile__img {
			transition: 0.3s ease;
			padding: 0;

			&:hover,
			&:focus {
				transform: scale(1.03);
			}
		}

		&__img {
			height: auto;
			width: 11rem;
			height: 11rem;
			border-radius: 50%;
			object-fit: cover;
			cursor: pointer;
			transition:
				transform 0.3s ease,
				box-shadow 0.3s ease;
		}

		&__username {
			font-weight: 600;
			color: var(--text-color);
			font-size: 4rem;
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

				.profile__username {
					font-size: 2.5rem;
				}
			}
		}
	}
</style>
