<script lang="ts">
	import { logoutUser } from '../../api/auth/logout';

	import Header from '../../components/Header.svelte';
	import Message from '../../components/Message.svelte';

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

<Header />

<main class="profile">
	<h1>Тут инфа о пользователе (имя, почта и тп.)</h1>
	<div class="profile__logout">
		<button class="logout-btn" on:click={handleLogout}>Выйти</button>
	</div>
</main>

{#if message}
	<Message type={messageType} {message} />
{/if}

<style lang="scss">
	.profile {
		.profile__logout {
			display: flex;
			justify-content: center;
			margin-top: 20px;

			.logout-btn {
				background-color: var(--primary-color);
				color: #fff;
				padding: 10px 20px;
				border: none;
				border-radius: 4px;
				cursor: pointer;
				transition: background-color 0.3s ease;

				&:hover {
					background-color: var(--primary-color-hover);
				}
			}
		}
	}
</style>
