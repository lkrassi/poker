<script lang="ts">
	import { goto } from '$app/navigation';

	const goRegister = () => {
		goto('/register');
	};

	const goLogin = () => {
		goto('/login');
	};
</script>

<div class="first-page-content background-image">
	<h1 class="first-page-content__title">CARD HOUSE</h1>
	<div class="first-page-content__crossing-buttons">
		<button id="first-page-content__goto-register-btn" on:click={goRegister}
			>Зарегистрировать новый аккакунт</button
		>
		<button id="first-page-content__goto-login-btn" on:click={goLogin}
			>Войти в существующий аккаунт</button
		>
	</div>
</div>

<style lang="scss">
	.first-page-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
		min-height: 100vh;

		.first-page-content__title {
			font-size: 8rem;
			color: var(--text-color);
			text-align: center;
		}

		.first-page-content__crossing-buttons {
			margin-top: 20px;
			display: flex;
			gap: 1rem;

			#first-page-content__goto-register-btn,
			#first-page-content__goto-login-btn {
				width: 18.5rem;
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
	}

	@media (max-width: 576px) {
		.first-page-content {
			.first-page-content__title {
				font-size: 5rem;
			}

			.first-page-content__crossing-buttons {
				flex-direction: column;
			}
		}
	}
</style>
