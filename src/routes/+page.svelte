<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemeSwitcher from '../components/ThemeSwitcher.svelte';

	const goRegister = () => {
		goto('/register');
	};

	const goLogin = () => {
		goto('/login');
	};
</script>

<div class="theme-switcher">
	<ThemeSwitcher />
</div>

<section class="first-page">
	<h1 class="first-page__title">POKER CLUB</h1>
	<div class="first-page__crossing-buttons">
		<button id="first-page__goto-register-btn" on:click={goRegister}
			>Зарегистрировать новый аккакунт</button
		>
		<button id="first-page__goto-login-btn" on:click={goLogin}>Войти в существующий аккаунт</button>
	</div>
</section>

<style lang="scss">
	.theme-switcher {
		display: flex;
		justify-content: end;
		margin: 40px 20px;
	}

	.first-page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 80vh;

		.first-page__title {
			font-size: 42px;
		}

		.first-page__crossing-buttons {
			margin-top: 20px;
			display: flex;
			gap: 20px;

			#first-page__goto-register-btn,
			#first-page__goto-login-btn {
				width: 18rem;
				padding: 10px 15px;
				font-size: 16px;
				color: #fff;
				background-color: var(--primary-color);
				border-radius: 4px;
				cursor: pointer;
				transition:
					background-color 0.3s ease,
					transform 0.1s ease;

				&:hover,
				&:focus {
					background-color: var(--primary-color-hover);
				}

				&:active {
					transform: scale(0.98);
				}
			}
		}
	}

	@media (max-width: 768px) {
		.first-page__crossing-buttons {
			flex-direction: column;
		}
	}
</style>
