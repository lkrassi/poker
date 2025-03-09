<script lang="ts">
	import { goto } from '$app/navigation';

	const goRegister = () => {
		goto('/register');
	};

	const goLogin = () => {
		goto('/login');
	};
</script>

<section class="first-page">
	<h1 class="first-page__title">TEMPLE UNION</h1>
	<div class="first-page__crossing-buttons">
		<button id="first-page__goto-register-btn" on:click={goRegister}
			>Зарегистрировать новый аккакунт</button
		>
		<button id="first-page__goto-login-btn" on:click={goLogin}>Войти в существующий аккаунт</button>
	</div>
</section>

<style lang="scss">
	.first-page {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		min-height: 100vh;
		background-image: url(../assets/images/auth-background.png);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

		.first-page__title {
			font-size: 5rem;
			color: var(--text-color);
			text-align: center;
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
				border-radius: 20px;
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

	@media (max-width: 576px) {
		.first-page {
			.first-page__title {
				font-size: 3rem;
			}
		}

		.first-page__crossing-buttons {
			flex-direction: column;
		}
	}
</style>
