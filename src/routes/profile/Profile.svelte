<script lang="ts">
	import { logoutUser } from '../../api/auth/logout';

	import Header from '../../components/Header.svelte';
	import Message from '../../components/Message.svelte';

	import userImg from '../../assets/images/auth-background.png';

	import { goto } from '$app/navigation';

	let message: string = '';
	let messageType: 'success' | 'error' | 'info' = 'info';

	const handleLogout = async () => {
		const result = await logoutUser();

		if (result.success) {
			messageType = 'success';
			message = 'Выход выполнен успешно!';
			goto('/login');
		} else {
			messageType = 'error';
			message = result.message;
		}
	};
</script>

<section class="profile-page">
	<Header />

	<Message type={messageType} {message} />

	<h1 style="text-align: center; margin: 0 0 5rem; font-size: 10rem;">ТОК ВЕРСТКА</h1>

	<h1 style="text-align: center; margin: 0 0 5rem; font-size: 10rem;">ЭТО ПОКА ЧТО ЕС ЧЕ</h1>

	<div class="profile">
		<div class="profile__user-data">
			<img class="profile__user-data__img" src={userImg} alt="Аватарка пользователя" />
			<h1 class="profile__user-data__username">BOBUS</h1>
		</div>

		<div class="profile__top-players">
			<h2 class="profile__top-players__title">Топ игроков</h2>
			<p class="profile__top-players__first">BOBUS</p>
			<p class="profile__top-players__second">AUTOBUS</p>
			<p class="profile__top-players__third">ДАНИИЛ</p>
		</div>

		<div class="profile__achievements">
			<h2 class="profile__achievements__title">Достижения</h2>
			<p class="profile__achievements__first">Выиграть 5 раз подряд</p>
			<p class="profile__achievements__second">Сделать подарок</p>
			<p class="profile__achievements__third">Проиграть 10 раз подряд</p>
		</div>

		<div class="profile__balance">
			<h2 class="profile__balance__title">Баланс</h2>
			<p class="profile__balance__amount">9999</p>
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
			align-items: start;

			.profile__user-data {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 10px;

				.profile__user-data__img {
					width: 100%;
					height: 15rem;
					border-radius: 15px;
				}

				.profile__user-data__username {
					margin: 0;
					text-align: center;
				}
			}

			.profile__achievements {
				text-align: center;
				background-color: var(--primary-color);
				color: var(--bg-color);
				padding: 1rem;
				border-radius: 15px;

				.profile__achievements__title {
					background-color: #ccc;
					border-radius: 10px;
					margin-bottom: 1rem;
				}

				.profile__achievements__first,
				.profile__achievements__second,
				.profile__achievements__third {
					margin-top: 2rem;
					border: 1px var(--bg-color) solid;
					padding: 0.5rem;
					border-radius: 10px;
				}
			}

			.profile__top-players {
				text-align: center;
				background-color: var(--primary-color);
				color: var(--bg-color);
				padding: 1rem;
				border-radius: 15px;

				.profile__top-players__title {
					background-color: #ccc;
					border-radius: 10px;
					margin-bottom: 1rem;
				}

				.profile__top-players__first,
				.profile__top-players__second,
				.profile__top-players__third {
					margin-top: 2rem;
					border: 1px var(--bg-color) solid;
					padding: 0.5rem;
					border-radius: 10px;
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
					background-color: var(--primary-color);
					color: #fff;
					padding: 10px 20px;
					border: none;
					border-radius: 15px;
					cursor: pointer;
					transition: background-color 0.3s ease;

					&:hover {
						background-color: var(--primary-color-hover);
					}
				}
			}
		}
	}
</style>
