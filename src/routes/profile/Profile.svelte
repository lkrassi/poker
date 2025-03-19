<script lang="ts">
	import { getUserByUsername } from '../../api/user/getUserByUsername';

	import Header from '../../components/Header.svelte';
	import Ellipsis from './Ellipsis.svelte';
	import Logout from './Logout.svelte';

	import ChipsIcon from '../../assets/icons/ChipsIcon.svelte';

	import { userStore, setUser } from '../../stores/userStore';
	import { showMessage } from '../../stores/messageStore';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isImageModalOpen: boolean = false;

	onMount(async () => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		} else {
			await getUserByUsername();
		}

		if (!$userStore.user) {
			goto('/login');
			showMessage('error', 'Для доступа к этой странице необходимо войти в аккаунт');
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

	onMount(() => {
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<section class="profile-page">
	<Header />

	{#if $userStore.user}
		<div class="profile">
			<div class="profile__user-data">
				<div class="profile__user-data__img-actions">
					<img
						class="profile__user-data__img"
						src={`https://${$userStore.user?.profile_picture_url}`}
						alt="Аватарка пользователя"
						on:click={openImageModal}
					/>
					<Ellipsis />
				</div>
				<h2 class="profile__user-data__username">
					{$userStore.user?.username}
				</h2>
				<p class="profile__user-data__balance">
					{$userStore.user?.balance}
					<span class="icon-wrapper"><ChipsIcon /></span>
				</p>
			</div>

			<Logout />
		</div>
	{/if}
</section>

{#if isImageModalOpen && $userStore.user}
	<button class="modal-overlay" on:click={closeImageModal}>
		<div class="modal-content">
			<img
				src={`https://${$userStore.user.profile_picture_url}`}
				alt="Аватарка пользователя в полном размере"
				class="modal-image"
			/>
		</div>
	</button>
{/if}

<style lang="scss">
	.profile-page {
		min-height: 100vh;
		background-image: url(../../assets/images/background.jpg);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

		.profile {
			width: 96%;
			margin: 0 auto;
			border-radius: 20px;
			display: flex;
			flex-direction: column;
			align-items: start;

			.profile__user-data {
				display: flex;
				flex-direction: column;
				text-align: center;
				justify-content: center;
				align-items: center;
				background: transparent;
				padding: 0 3rem;

				.profile__user-data__img-actions {
					display: flex;

					.profile__user-data__img {
						width: 150px;
						height: 150px;
						border-radius: 50%;
						object-fit: cover;
						margin-bottom: 1.5rem;
						cursor: pointer;
						transition:
							transform 0.3s ease,
							box-shadow 0.3s ease;

						&:hover {
							transform: scale(1.05);
						}
					}
				}

				.profile__user-data__username {
					font-weight: 600;
					color: var(--text-color);
					font-size: 4rem;
					margin: 0 0 1rem;
					text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
				}

				.profile__user-data__balance {
					color: var(--text-color);
					font-size: 2rem;
					display: flex;
					align-items: center;
					gap: 0.5rem;
					font-weight: 700;
					transition:
						transform 0.3s ease,
						box-shadow 0.3s ease;

					.icon-wrapper {
						display: flex;
						align-items: center;
						justify-content: center;

						:global(svg) {
							width: 2rem;
							height: 2rem;
							animation: chipsGlow 2s infinite ease-in-out;
						}
					}
				}
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

	@keyframes chipsGlow {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}

	@media (max-width: 576px) {
		.profile-page {
			.profile {
				align-items: center;

				.profile__user-data {
					margin: 8rem 0 0;
					padding: 0;

					.profile__user-data__username {
						font-size: 2.5rem;
					}
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
