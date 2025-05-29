<script lang="ts">
	import { apiFacade } from '../../../shared/lib/api/apiFacade';

	import { showMessage } from '../../../shared/model/stores/messageStore';
	import { userStore } from '../model/stores/userStore';
	import { closeModal } from '../../../shared/model/stores/modalStore';

	import { onMount } from 'svelte';

	let newUsername = '';
	let currentUsername = '';

	onMount(() => {
		const unsubscribe = userStore.subscribe((store) => {
			if (store.user?.username) {
				currentUsername = store.user.username;
				newUsername = store.user.username;
			}
		});

		return () => unsubscribe();
	});

	async function handleUpdateUsername() {
		if (!newUsername || newUsername === currentUsername) {
			showMessage('error', 'Имя пользователя не может быть пустым или таким же как текущее');
			return;
		}

		const result = await apiFacade.updateUsername(newUsername);

		if (result.success) {
			showMessage('success', 'Имя пользователя успешно обновлено!');
			currentUsername = newUsername;
			closeModal();
		} else {
			showMessage('error', result.message || 'Ошибка при обновлении имени пользователя');
		}
	}
</script>

<form class="update-username" on:submit|preventDefault={handleUpdateUsername}>
	<div class="update-username__input-container">
		<input
			class="update-username__input"
			type="text"
			bind:value={newUsername}
			placeholder="Новое имя"
		/>
	</div>

	<button type="submit" class="update-username__button"> Обновить имя пользователя </button>
</form>

<style lang="scss">
	:global(.update-username-modal) {
		.update-username {
			width: 30rem;
			overflow-x: hidden;
		}
	}

	@media (max-width: 576px) {
		:global(.update-username-modal) {
			transform: translateY(-10rem);

			.update-username {
				width: 90%;
			}
		}
	}

	.update-username {
		&__input-container {
			position: relative;
			display: flex;
			align-items: center;
			margin-bottom: 1.5rem;
		}

		&__input {
			width: 100%;
			border: none;
			font-size: 4rem;
			color: var(--text-color);
			background: transparent;
			outline: none;
			transition: 0.3s ease;
			text-align: center;
			padding: 0;

			&::placeholder {
				color: var(--text-color);
				font-size: 4rem;
			}
		}

		&__button {
			color: var(--text-color);
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

	@media (max-width: 576px) {
		.update-username {
			&__input {
				font-size: 2.8rem;

				&::placeholder {
					font-size: 2.8rem;
				}
			}
		}
	}
</style>
