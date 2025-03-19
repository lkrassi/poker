<script lang="ts">
	import { clearLocalStorage } from '$lib/clearLocalStorage';

	import { clearUser } from '../../stores/userStore';
	import { showMessage } from '../../stores/messageStore';

	import { goto } from '$app/navigation';

	const handleLogout = () => {
		clearLocalStorage();
		clearUser();
		showMessage('success', 'Вы успешно вышли из аккаунта!');
		goto('/login');
	};
</script>

<div class="profile__logout">
	<button class="logout-btn" on:click={handleLogout}>Выйти</button>
</div>

<style lang="scss">
	.profile__logout {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 2rem;

		.logout-btn {
			color: #fff;
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
