<script lang="ts">
	import { getUserByUsername } from '../../api/user/getUserByUsername';

	import Header from '../../components/Header.svelte';
	import Ellipsis from './Ellipsis.svelte';
	import Logout from './Logout.svelte';
	import DailyReward from './DailyReward.svelte';

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
				<div class="profile__img-actions">
					<img
						class="profile__img"
						src={`https://${$userStore.user?.profile_picture_url}`}
						alt="Аватарка пользователя"
						on:click={openImageModal}
					/>
					<Ellipsis />
				</div>
				<h2 class="profile__username">
					{$userStore.user?.username}
				</h2>
				<p class="profile__balance">
					{$userStore.user?.balance}
					<span class="profile__icon-wrapper"><ChipsIcon /></span>
				</p>
				<Logout />
			</div>

			<DailyReward />

			<div class="profile__leaderboard">
				<h3 class="leaderboard__title">Топ игроков</h3>
				<ul class="leaderboard__list">
					{#each [1, 2, 3, 4, 5] as index}
						<li class="leaderboard__item">
							<span class="leaderboard__rank">{index + 1}</span>
							<span class="leaderboard__name">Игрок {index + 1}</span>
							<span class="leaderboard__score">{1000 - index * 200} очков</span>
						</li>
					{/each}
				</ul>
				<button class="leaderboard__view-all">Показать весь рейтинг</button>
			</div>
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
		width: 100%;
		padding: 1rem;
		box-sizing: border-box;

		.profile {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			width: 100%;
			margin: 0 auto;
			padding: 0 2rem;
			gap: 2rem;

			&__user-data {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
			}

			&__leaderboard {
				flex: 1;
				background: rgba(255, 255, 255, 0.1);
				backdrop-filter: blur(10px);
				border-radius: 16px;
				padding: 1.5rem;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
				max-width: 300px;
			}

			&__img-actions {
				display: flex;
			}

			&__img {
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

			&__username {
				font-weight: 600;
				color: var(--text-color);
				font-size: 4rem;
				margin: 0 0 1rem;
				text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
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
	}

	.leaderboard {
		&__title {
			color: white;
			font-size: 1.5rem;
			margin: 0 0 1rem;
			text-align: center;
			text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
		}

		&__list {
			list-style: none;
			padding: 0;
			margin: 0 0 1.5rem;
		}

		&__item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0.75rem 0;
			border-bottom: 1px solid rgba(255, 255, 255, 0.1);
			color: white;

			&:last-child {
				border-bottom: none;
			}
		}

		&__rank {
			font-weight: bold;
			width: 24px;
			text-align: center;
		}

		&__name {
			flex: 1;
			padding: 0 1rem;
		}

		&__score {
			font-weight: bold;
			color: #ffd700;
		}

		&__view-all {
			width: 100%;
			padding: 0.75rem;
			background: rgba(255, 255, 255, 0.2);
			border: none;
			border-radius: 8px;
			color: white;
			font-weight: bold;
			cursor: pointer;
			transition: background 0.3s ease;

			&:hover {
				background: rgba(255, 255, 255, 0.3);
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
		.profile-page {
			.profile {
				flex-wrap: wrap;
				padding: 0;
			}
		}
	}

	@media (max-width: 576px) {
		.profile-page {
			.profile {
				flex-direction: column;
				align-items: center;
				padding: 0;

				&__user-data {
					margin: 8rem 0 0;
					padding: 0;
					align-items: center;

					.profile__username {
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
