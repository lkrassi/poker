<script lang="ts">
	import { clearLocalStorage } from '../../../shared/index';

	import { clearUser } from '../model/stores/userStore';
	import { showMessage } from '../../../shared/index';

	import { goto } from '$app/navigation';

	const handleLogout = () => {
		clearLocalStorage();
		clearUser();
		showMessage('success', 'Вы успешно вышли из аккаунта!');
		goto('/login');
	};
</script>

<div class="logout">
	<button class="logout__button" on:click={handleLogout}>Выйти</button>
</div>

<style lang="scss">
	.logout {
		display: flex;
		justify-content: center;
		margin-top: 2rem;

		&__button {
			color: var(--text-color);
			background-color: var(--primary-color);
			transition: 0.3s ease;
			width: 10rem;

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
</style>
