<script lang="ts">
	import Header from '../../components/Header.svelte';
	import Message from '../../components/Message.svelte';
	import { goto } from '$app/navigation';
	import { clearLocalStorage } from '$lib/clearLocalStorage';

	import userImg from '../../assets/images/auth-background.png';

	let message: string = '';
	let messageType: 'success' | 'error' | 'info' = 'info';

	function handleLogout() {
		clearLocalStorage();

		messageType = 'success';
		message = 'Вы успешно вышли из аккаунта.';
		goto('/login');
	}
</script>

<section class="profile-page">
	<Header />

	<Message type={messageType} {message} />

	<div class="profile">
		<div class="profile__user-data">
			<img class="profile__user-data__img" src={userImg} alt="Аватарка пользователя" />
			<h1 class="profile__user-data__username">BOBUS</h1>
		</div>

		<div class="profile__logout">
			<button class="logout-btn" on:click={handleLogout}>Выйти</button>
		</div>
	</div>
</section>

<style lang="scss">
	.profile-page {
		.profile {
			width: 90%;
			margin: 0 auto;
			display: grid;
			grid-template-columns: 1fr 2fr;
			gap: 2rem;
			align-items: center;

			.profile__user-data {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 10px;

				.profile__user-data__img {
					width: 10rem;
					height: 10rem;
					border-radius: 50%;
				}

				.profile__user-data__username {
					margin: 0;
					text-align: center;
				}
			}

			.profile__balance {
				text-align: center;
				background-color: var(--primary-color);
				color: var(--bg-color);
				padding: 1rem;
				border-radius: 15px;

				.profile__balance__title {
					background-color: #ccc;
					border-radius: 10px;
					margin-bottom: 1rem;
				}

				.profile__balance__amount {
					margin-top: 2rem;
					padding: 0.5rem;
					font-size: 2rem;
				}
			}

			.profile__logout {
				grid-column: 1 / -1;
				display: flex;
				justify-content: center;
				margin: 2rem 0;

				.logout-btn {
					width: 10rem;
					color: #fff;
					background-color: var(--primary-color);
					transition: 0.3s ease;

					&:hover,
					&:focus {
						background-color: var(--primary-color-hover);
						transform: scale(1.01);
					}

					&:active {
						transform: scale(0.99);
					}
				}
			}
		}
	}
</style>
