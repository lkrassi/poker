<script lang="ts">
	import UserIcon from '../../assets/icons/UserIcon.svelte';

	import { showMessage } from '../../stores/messageStore';

	import { withLoader } from '$lib/loader';
	import { apiFacade } from '$lib/apiFacade';

	let newUsername = '';

	async function handleUpdateUsername() {
		if (!newUsername) {
			showMessage('error', 'Имя пользователя не может быть пустым');
			return;
		}

		if (newUsername.length < 4) {
			showMessage('error', 'Имя пользователя может содержать от 4 до 32 символов');
			return;
		}

		const result = await withLoader(apiFacade.updateUsername(newUsername));

		if (result.success) {
			showMessage('success', 'Имя пользователя успешно обновлено!');
			newUsername = '';
		} else {
			showMessage('error', result.message || 'Ошибка при обновлении имени пользователя');
		}
	}
</script>

<form class="update-username">
	<h2 class="update-username__title">Смена имени</h2>
	<div class="update-username__input-container">
		<UserIcon />
		<input
			class="update-username__input"
			type="text"
			bind:value={newUsername}
			placeholder="Новое имя"
		/>
	</div>

	<button type="submit" class="update-username__button" on:click={handleUpdateUsername}>
		Обновить имя пользователя
	</button>
</form>

<style lang="scss">
	.update-username {
		&__title {
			font-size: 2.2rem;
			color: var(--text-color);
			text-align: center;
		}

		&__input-container {
			position: relative;
			display: flex;
			align-items: center;
		}

		&__input {
			width: 100%;
			padding-left: 40px;
			border: 1px solid var(--border-color);
			border-radius: 15px;
			font-size: 16px;
			color: var(--text-color);
			background: transparent;
			transition: 0.3s ease;

			&::placeholder {
				color: var(--text-color);
			}

			&:focus {
				border-color: var(--text-color);
				outline: none;
				box-shadow: 0 0 8px rgba(var(--primary-color-rgb), 0.4);
			}
		}

		&__button {
			color: var(--text-color);
			background-color: var(--primary-color);
			transition: 0.3s ease;
			width: 100%;
			padding: 10px;
			border: none;
			border-radius: 15px;
			cursor: pointer;

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

	@media (max-width: 576px) {
		.update-username {
			&__title {
				font-size: 1.9rem;
			}
		}
	}
</style>
