<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="first-page-content background-image">
	<h1 class="first-page-content__title">ДОБРО ПОЖАЛОВАТЬ В CARD HOUSE</h1>
	<div class="first-page-content__crossing-buttons">
		<button id="first-page-content__goto-register-btn" on:click={() => goto('/register')}
			>Зарегистрировать новый аккакунт</button
		>
		<button id="first-page-content__goto-login-btn" on:click={() => goto('/login')}
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

		&__title {
			font-size: 4rem;
			color: var(--text-color);
			text-align: center;
		}

		&__crossing-buttons {
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
			&__title {
				font-size: 2.2rem;
			}

			&__crossing-buttons {
				flex-direction: column;
			}
		}
	}
</style>
